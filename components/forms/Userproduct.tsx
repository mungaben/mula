'use client';

import * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { useToast } from '../ui/use-toast';

const productSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  price: z.number().nonnegative({ message: 'Price must be non-negative' }),
  DaysToExpire: z.number().optional().refine((val) => val === undefined || val >= 0, {
    message: 'Days to Expire must be non-negative',
  }),
  earningPer24Hours: z.number().nonnegative({ message: 'Earnings per 24 hours must be non-negative' }),
  growthPercentage: z.number().optional().refine((val) => val === undefined || (val >= 0 && val <= 100), {
    message: 'Growth percentage must be between 0 and 100',
  }),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: ProductFormValues;
  productId?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, productId }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);


  console.info("**************************************************************************");
  console.info("*initial data **",initialData);
  console.info("**************************************************************************");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: '',
      price: 0,
      DaysToExpire: undefined,
      earningPer24Hours: 0,
      growthPercentage: undefined,
    },
  });

  const onSubmit = async (data: ProductFormValues, method: 'POST' | 'PUT') => {
    try {
      setLoading(true);
      const url = method === 'POST' ? '/api/products' : `/api/products/${productId}`;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${method === 'POST' ? 'create' : 'update'} product`);
      }

      router.push('/dashboard/product');
      toast({
        title: 'Success!',
        description: `Product ${method === 'POST' ? 'created' : 'updated'} successfully.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error!',
        description: `There was a problem ${method === 'POST' ? 'creating' : 'updating'} the product.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Heading title={productId ? 'Edit Product' : 'Create Product'} description="Enter the details of the product below." />
      <Separator />
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="DaysToExpire"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Days to Expire</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="earningPer24Hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Earnings per 24 Hours</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="growthPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Growth Percentage</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex space-x-2">
            <Button
              type="button"
              onClick={() => form.handleSubmit((data) => onSubmit(data, 'POST'))()}
              disabled={loading}
              className="ml-auto"
            >
              Create Product
            </Button>
            {productId && (
              <Button
                type="button"
                onClick={() => form.handleSubmit((data) => onSubmit(data, 'PUT'))()}
                disabled={loading}
                className="ml-auto"
              >
                Update Product
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
