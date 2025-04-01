import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class ShopifyService {
  private shopifyBaseUrl: string;

  constructor() {
    this.shopifyBaseUrl = `https://${process.env.SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2024-10/graphql.json`;
  }


  // async getCustomersFromShopify() {
  //   try {
  //     const response: AxiosResponse = await axios.post(
  //       this.shopifyBaseUrl,
  //       {
  //         query: `query { customers(first: 250) { edges { node { id email createdAt phone firstName lastName orders(first: 10) { edges { node { lineItems(first: 5) { edges { node { title } } } } } } } } pageInfo { hasNextPage endCursor } } }`,
  //       },
  //       {
  //         headers: {
  //           'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
  //           'Content-Type': 'application/json',
  //         },
  //       },
  //     );
  //     const { edges } = response.data.data.customers;

  //     const customersBatch = edges.map((edge: any) => {
  //       const { id, orders, ...customerData } = edge.node;
  //       const numericId = id.split('/').pop()?.split('?')[0];
        
  //       // Initialize role and courses
  //       let role = null;
  //       let courses = [];
      
  //       if (orders?.edges?.length > 0) {
  //         // Check if there are more than 1 order
  //         if (orders.edges.length > 1) {
  //           role = 'lashArtist';
  //         }
      
  //         // Process each order
  //         orders.edges.forEach((orderEdge: any) => {
  //           const lineItems = orderEdge.node.lineItems.edges;
      
  //           lineItems.forEach((item: any) => {
  //             if (item.node.title.toLowerCase().includes('course')) {
  //               role = 'student';
  //               courses.push(item.node.title); // Collect course titles
  //             }
  //           });
  //         });
  //       }
      
  //       // Join course titles with a comma
  //       const coursesKey = courses.length > 0 ? courses.join(', ') : undefined;
      
  //       // Return the updated customer object
  //       return {
  //         id: numericId,
  //         ...customerData,
  //         role,
  //         courses: coursesKey,
  //       };
  //     });
  //     return customersBatch
  //   } catch (error) {
  //     console.error('Error fetching customers from Shopify:', error);
  //     throw error;
  //   }
  // }
  async getCustomersFromShopify() {
    try {
      let allCustomers = [];
      let hasNextPage = true;
      let endCursor = null;

      while (hasNextPage) {
        const response = await axios.post(
          this.shopifyBaseUrl,
          {
            query: `query {
              customers(first: 250, after: ${endCursor ? `"${endCursor}"` : null}) {
                edges {
                  node {
                    id
                    email
                    createdAt
                    phone
                    firstName
                    lastName
                    orders(first: 10) {
                      edges {
                        node {
                          lineItems(first: 5) {
                            edges {
                              node {
                                title
                              }
                            }
                          }
                        }
                      }
                    }
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
          }
        );

        const { edges, pageInfo } = response.data.data.customers;

        const customersBatch = edges.map((edge) => {
          const { id, orders, ...customerData } = edge.node;
          const numericId = id.split('/').pop()?.split('?')[0];

          let role = null;
          let courses = [];

          if (orders?.edges?.length > 0) {
            if (orders.edges.length > 1) {
              role = 'lashArtist';
            }
            orders.edges.forEach((orderEdge) => {
              const lineItems = orderEdge.node.lineItems.edges;
              lineItems.forEach((item) => {
                if (item.node.title.toLowerCase().includes('course')) {
                  role = 'student';
                  courses.push(item.node.title);
                }
              });
            });
          }

          return {
            id: numericId,
            ...customerData,
            role,
            courses: courses.length > 0 ? courses.join(', ') : undefined,
          };
        });

        allCustomers = [...allCustomers, ...customersBatch];
        hasNextPage = pageInfo.hasNextPage;
        endCursor = pageInfo.endCursor;
      }

      return allCustomers;
    } catch (error) {
      console.error('Error fetching customers from Shopify:', error);
      throw error;
    }
  }

}
