import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import { In, IsNull, Not, Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { ShopifyService } from './shopify.service';
import { getCoordinatesFromAddress } from 'src/utils/geoUtils';
import { BusinessDetails } from '../business-details/business-details.entity';
import { UpdateRoleDto } from './update-role.dto';

export async function sendEmail(
  firstName: string,
  email: string,
  password: string,
): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Create Your Listing on the Light Heart Artist Map!',
    text: `Hi ${firstName},
  
  We would love to display your business on the newly improved Light Heart Artist Map. This is a free marketing tool that we have developed for our customers and students to help clients find talented artists in their area.
  
  *Follow These Steps To Create Your New Listing:*
  1. Use the following information to log in to your new account:
  
     Your Email: ${email}  
     Your Temporary Password: ${password}
  
  2. Click or tap on the menu in the top left and go to *My Profile*  
  3. Click or tap *Edit Profile* to add your business information and get displayed on our map.  
  
  Log in and add your business here: ${process.env.FRONTEND_URL}
  
  The map will automatically add any Light Heart courses you take to your profile.
  
  If you ever need to update your business information, just go to the "Find An Artist" page on our website and log in to update your info.
  `,
    html: `<p>Hi ${firstName},</p>
           <p>We would love to display your business on the newly improved <strong>Light Heart Artist Map</strong>. This is a free marketing tool that we have developed for our customers and students to help clients find talented artists in their area.</p>
           <p><strong>Follow These Steps To Create Your New Listing:</strong></p>

             <p><strong>1.</strong> Use the following information to log in to your new account:</p>
             <p><strong>Your Email:</strong> ${email}</p>
             <p><strong>Your Temporary Password:</strong> ${password}</p>
             <p> <strong>2.</strong>  Click or tap on the menu in the top left and go to <strong>My Profile</strong></p>
             <p> <strong>3.</strong> Click or tap <strong>Edit Profile</strong> to add your business information and get displayed on our map.</p>

           <p><a href="${process.env.FRONTEND_URL}" target="_blank"><strong>Log in and add your business Here!</strong></a></p>
           <p>The map will automatically add any Light Heart courses you take to your profile.</p>
           <p>If you ever need to update your business information, just go to the <strong>"Find An Artist"</strong> page on our website and log in to update your info.</p>`,
  });
}

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(BusinessDetails)
    private readonly businessDetailsRepository: Repository<BusinessDetails>,
    private readonly shopifyService: ShopifyService,
    private readonly jwtService: JwtService,
  ) {}

  // async handleAddresses(customer: any, savedCustomer: Customer): Promise<void> {
  //   for (const address of customer.addresses || []) {
  //     const fullAddress = `${address.address1}, ${address.address2 || ''}, ${address.city}, ${address.country}`;
  //     try {
  //       const { lat, lng } = await getCoordinatesFromAddress(fullAddress);

  //       const newAddress = this.addressRepository.create({
  //         customerId: `${savedCustomer.customerId}`,
  //         addressId: address.id,
  //         address1: address.address1,
  //         address2: address.address2 || null,
  //         city: address.city,
  //         province: address.province || null,
  //         country: address.country,
  //         zip: address.zip,
  //         phone: address.phone || null,
  //         name: address.name || null,
  //         default: address.default || false,
  //         latitude: lat,
  //         longitude: lng,
  //         customer: savedCustomer,
  //       });

  //       await this.addressRepository.save(newAddress);
  //     } catch (error) {
  //       console.error(
  //         `Error fetching or saving address for customer ${customer.id}:`,
  //         error,
  //       );
  //     }
  //   }
  // }

  private async sendResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"Light Heart Map" <no-reply@lightheartmap.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetUrl}" style="color: blue; text-decoration: underline;" target="_blank">Reset Password</a></p>
        <p>If the above link doesn't work, copy and paste the following URL into your browser:</p>
        <p>${resetUrl}</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
  }

  async getCustomerById(id: string): Promise<{
    message: string;
    customer?: Customer;
    businessDetails?: object;
  }> {
    const customer = await this.customerRepository.findOne({
      where: { customerId: id },
    });

    if (!customer) {
      return {
        message: `Customer with ID ${id} not found.`,
      };
    }

    const businessDetails = await this.businessDetailsRepository.findOne({
      where: { customerId: id },
    });

    return {
      message: 'Customer retrieved successfully.',
      customer,
      businessDetails: businessDetails || {},
    };
  }

  async getAllCustomers(
    page: number,
    limit: number,
  ): Promise<{
    message: string;
    customers: Customer[];
    pagination: { total: number; page: number; limit: number };
  }> {
    const [customers, totalCount] = await this.customerRepository.findAndCount({
      where: [{ role: Not('admin') }, { role: IsNull() }],
      take: limit,
      skip: (page - 1) * limit,
      order: {
        createdAt: 'ASC', // Replace with the column you want to sort by
      },
    });

    return {
      message: 'Customers retrieved successfully.',
      customers,
      pagination: {
        total: totalCount,
        page,
        limit,
      },
    };
  }

  async saveCustomersOnce(): Promise<void> {

    //Send static email for testing
    // const rawPassword = Math.random().toString(36).slice(-8);
    //       const hashedPassword = await bcrypt.hash(rawPassword, 10);

    //       const newCustomer = this.customerRepository.create({
    //         customerId: '90988772263636631',
    //         email: "elliottmmorris@gmail.com",
    //         createdAt:  new Date(),
    //         firstName: 'Elliot',
    //         lastName: "Morris" ,
    //         phone: "7283733788229",
    //         password: hashedPassword,
    //         role: 'admin',
    //         courses: '',
    //       });
    //       console.log("+++", rawPassword)
    //       await this.customerRepository.save(newCustomer);
          
    //           await sendEmail(
    //             newCustomer.firstName,
    //             newCustomer.email,
    //             rawPassword,
    //           )

    const customers = await this.shopifyService.getCustomersFromShopify();
    const customerIds = customers.map((c) => `${c.id}`);

    const existingCustomers = await this.customerRepository.find({
      where: { customerId: In(customerIds) },
      select: ['customerId'],
    });

    const existingCustomerIds = new Set(
      existingCustomers.map((c) => c.customerId),
    );
    const failedCustomers = [];

    for (const customer of customers) {
      if (!existingCustomerIds.has(`${customer.id}`)) {
        try {
          const rawPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = await bcrypt.hash(rawPassword, 10);

          const newCustomer = this.customerRepository.create({
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
          await this.customerRepository.save(newCustomer);
          

          if (customer.email) {
              await sendEmail(
                newCustomer.firstName,
                newCustomer.email,
                rawPassword,
              )
          }
        } catch (error) {
          console.error(`Error processing customer ${customer.id}:`, error);
          failedCustomers.push({
            customerId: customer.id,
            reason: 'Insertion failed',
          });
        }
      }
    }


    if (failedCustomers.length > 0) {
      console.warn(
        `Failed to process ${failedCustomers.length} customers.`,
        failedCustomers,
      );
    }
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.customerRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    const token = this.jwtService.sign({ userId: user.id });
    return { message: 'Login successful', token, user };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const customer = await this.customerRepository.findOne({
      where: { email },
    });

    if (!customer) {
      throw new NotFoundException('No account found with that email.');
    }

    const token = this.jwtService.sign(
      { customerId: customer.id },
      { secret: process.env.JWT_SECRET, expiresIn: '1h' },
    );

    await this.sendResetEmail(customer.email, token);

    return { message: 'Password reset link has been sent to your email.' };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const { customerId } = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const customer = await this.customerRepository.findOne({
        where: { id: customerId },
      });

      if (!customer) {
        throw new NotFoundException('Customer not found.');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      customer.password = hashedPassword;
      await this.customerRepository.save(customer);

      return { message: 'Password reset successfully.' };
    } catch (err) {
      throw new BadRequestException('Invalid or expired token.');
    }
  }

  async updateCustomerRole(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<{ message: string; customer?: Customer }> {
    const customer = await this.customerRepository.findOne({
      where: { customerId: id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }

    customer.role = updateRoleDto.role;
    await this.customerRepository.save(customer);

    return {
      message: `Customer's role updated successfully.`,
      customer,
    };
  }

  private haversine(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Radius of Earth in km
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) *
        Math.cos(this.degreesToRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  async findNearbyCustomers(
    lat: number,
    lng: number,
    radius: number,
    page: number,
    limit: number,
    roles: string[],
  ): Promise<{
    message: string;
    customers: { customer: Customer; businessProfile: {} }[];
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
  }> {
    // Fetch customers and their business details
    const customers = await this.customerRepository.find();

    // Filter customers whose business details fall within the radius
    const nearbyCustomers = await Promise.all(
      customers.map(async (customer) => {
        const businessProfile = await this.businessDetailsRepository.findOne({
          where: { customerId: customer.customerId }, // Using customerId to get business details
        });

        if (businessProfile) {
          const distance = this.haversine(
            lat,
            lng,
            businessProfile.latitude,
            businessProfile.longitude,
          );

          if (distance <= radius) {
            return {
              customer,
              businessProfile,
            };
          }
        }

        return null;
      }),
    );

    let filteredCustomers = nearbyCustomers.filter(
      (customer) => customer !== null,
    );

    if (roles.length > 0) {
      filteredCustomers = filteredCustomers.filter((entry) =>
        roles.includes(entry.customer.role),
      );
    }

    if (filteredCustomers.length === 0) {
      throw new NotFoundException(
        'No customers found within the specified radius and roles.',
      );
    }

    const total = filteredCustomers.length;

    // Apply pagination
    const paginatedCustomers = filteredCustomers.slice(
      (page - 1) * limit,
      page * limit,
    );

    return {
      message: 'Nearby customers retrieved successfully.',
      customers: paginatedCustomers,
      pagination: {
        total,
        page,
        limit,
      },
    };
  }
}
