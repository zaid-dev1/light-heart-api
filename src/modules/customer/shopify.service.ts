import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class ShopifyService {
  private shopifyBaseUrl: string;

  constructor() {
    this.shopifyBaseUrl = `https://${process.env.SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2024-10/graphql.json`;
  }
  //old
  // async getCustomersFromShopify(limit: number = 250): Promise<any[]> {
  //   const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  //   const url = `${this.shopifyBaseUrl}/graphql.json`;
  //   let afterCursor = '';
  //   let hasNextPage = true;
  //   const allCustomers = [];

  //   while (hasNextPage) {
  //     const query = `
  //       query ($cursor: String) {
  //         customers(first: ${limit}, after: $cursor) {
  //           edges {
  //             node {
  //               id
  //               firstName
  //               lastName
  //               email
  //               phone
  //               createdAt
  //               updatedAt
  //               tags
  //               note
  //               state
  //               verifiedEmail
  //               addresses {
  //                 id
  //                 address1
  //                 address2
  //                 city
  //                 province
  //                 zip
  //                 country
  //                 firstName
  //                 lastName
  //                 phone
  //                 company
  //               }
  //               defaultAddress {
  //                 address1
  //                 address2
  //                 city
  //                 province
  //                 zip
  //                 country
  //                 firstName
  //                 lastName
  //                 phone
  //                 company
  //               }
  //             }
  //           }
  //           pageInfo {
  //             hasNextPage
  //             endCursor
  //           }
  //         }
  //       }
  //     `;

  //     const variables = { cursor: afterCursor || null };

  //     try {
  //       const response: AxiosResponse = await axios.post(
  //         url,
  //         { query, variables },
  //         {
  //           headers: {
  //             'X-Shopify-Access-Token': accessToken,
  //             'Content-Type': 'application/json',
  //           },
  //         },
  //       );

  //       const { edges, pageInfo } = response.data.data.customers;
  //       hasNextPage = pageInfo.hasNextPage;
  //       afterCursor = pageInfo.endCursor;

  //       const customersBatch = edges.map((edge: any) => {
  //         const { id, addresses, ...customerData } = edge.node;
  //         const numericId = id.split('/').pop()?.split('?')[0];

  //         const transformedAddresses = addresses.map((address: any) => {
  //           const { id, ...addressData } = address;
  //           const addressNumericId = id.split('/').pop()?.split('?')[0];
  //           return {
  //             id: addressNumericId,
  //             ...addressData,
  //           };
  //         });

  //         return {
  //           id: numericId,
  //           addresses: transformedAddresses,
  //           ...customerData,
  //         };
  //       });

  //       allCustomers.push(...customersBatch);
  //     } catch (error) {
  //       console.error(`Error fetching customers:`, error);
  //       throw error;
  //     }
  //   }

  //   return allCustomers;
  // }

  async getCustomersFromShopify() {
    try {
      const response: AxiosResponse = await axios.post(
        this.shopifyBaseUrl,
        {
          query: `query {
            customers(first: 5) {
              edges {
                node {
                  id
                  firstName
                  lastName
                  email
                  phone
                  createdAt
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }`,
        },
        {
          headers: {
            'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
        },
      );

      const { edges } = response.data.data.customers;
      const customersBatch = edges.map((edge: any) => {
        const { id, ...customerData } = edge.node;
        const numericId = id.split('/').pop()?.split('?')[0];
        return {
          id: numericId,
          ...customerData,
        };
      });

      return customersBatch;
    } catch (error) {
      console.error('Error fetching customers from Shopify:', error);
      throw error;
    }
  }
}