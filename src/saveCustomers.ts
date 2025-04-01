import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { Customer } from './modules/customer/customer.entity';
import { sendEmail } from './modules/customer/customer.service';
import { ShopifyService } from './modules/customer/shopify.service';
import dataSource, { initializeDatabaseConnection } from './config/typeorm.config';
import { In } from 'typeorm';

interface FailedCustomer {
  customerId: string;
  reason: string;
}

async function saveCustomersOnce(): Promise<void> {
  try {
    console.log("script running")
    await initializeDatabaseConnection();
    console.log("DATABASE CONNECTED")

    const customerRepository = dataSource.getRepository(Customer);
    const shopifyService = new ShopifyService();
    const customers = await shopifyService.getCustomersFromShopify();
    const customerIds = customers.map((c) => `${c.id}`);

    console.log("cutsomer fetched", customers?.length || 0)

    const existingCustomers = await customerRepository.find({
        where: { customerId: In(customerIds) },
        select: ['customerId'],
      });

    const existingCustomerIds = new Set(existingCustomers.map((c) => c.customerId));
    const failedCustomers: FailedCustomer[] = [];

    for (const customer of customers) {
      if (!existingCustomerIds.has(`${customer.id}`)) {
        try {
          const rawPassword: string = Math.random().toString(36).slice(-8);
          const hashedPassword: string = await bcrypt.hash(rawPassword, 10);

          const newCustomer = customerRepository.create({
            customerId: `${customer.id}`,
            email: customer.email,
            createdAt: customer.createdAt || null,
            firstName: customer.firstName || null,
            lastName: customer.lastName || null,
            phone: customer.phone || null,
            password: hashedPassword,
            role: customer.role || null,
            courses: customer.courses || '',
          });
          await customerRepository.save(newCustomer);

          if (customer.email) {
            await sendEmail(newCustomer.firstName, newCustomer.email, rawPassword);
          }
          console.log('Customer saved:', newCustomer);
        } catch (error) {
          console.error(`Error processing customer ${customer.id}:`, error);
          failedCustomers.push({ customerId: customer.id, reason: 'Insertion failed' });
        }
      }
    }

    if (failedCustomers.length > 0) {
      console.warn(`Failed to process ${failedCustomers.length} customers.`, failedCustomers);
    }
  } catch (error) {
    console.error('Error initializing script:', error);
  } finally {
    await dataSource.destroy();
    console.log('Database connection closed');
  }
}

saveCustomersOnce();
