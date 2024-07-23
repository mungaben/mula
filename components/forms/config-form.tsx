'use client';

import * as z from 'zod';
import { useState, useEffect } from 'react';
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

const configSchema = z.object({
  id: z.string().optional(),
  minWithdrawalAmount: z.number().nonnegative({ message: 'Must be non-negative' }),
  withdrawalFeePercentage: z.number().min(0).max(100, { message: 'Must be between 0 and 100' }),
  minBalance: z.number().nonnegative({ message: 'Must be non-negative' }),
  level1Percentage: z.number().min(0).max(100, { message: 'Must be between 0 and 100' }),
  level2Percentage: z.number().min(0).max(100, { message: 'Must be between 0 and 100' }),
  level3Percentage: z.number().min(0).max(100, { message: 'Must be between 0 and 100' }),
  initialBal: z.number().nonnegative({ message: 'Must be non-negative' }),
  linkLifetime: z.number().nonnegative({ message: 'Must be non-negative' }),
});

type ConfigFormValues = z.infer<typeof configSchema>;

interface ConfigFormProps {
  initialData: ConfigFormValues | null;
}

export const ConfigForm: React.FC<ConfigFormProps> = ({ initialData }) => {
  console.log("initialdaa",initialData);
  
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Initial Data:', initialData);
  }, [initialData]);

  const defaultValues = initialData || {
    id: undefined,
    minWithdrawalAmount: 0,
    withdrawalFeePercentage: 0,
    minBalance: 0,
    level1Percentage: 0,
    level2Percentage: 0,
    level3Percentage: 0,
    initialBal:0,
    linkLifetime: 0,
  };

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues,
  });

  const onSubmit = async (data: ConfigFormValues) => {
    console.log("data to put", data);
    
    try {
      setLoading(true);
      const method = initialData?.id ? 'PUT' : 'POST';

      console.log("method", method, data)

      console.log("data",data);
      
    //   const url = `/api/config${data.id ? `/${data.id}` : ''}`;
      const url="/api/config"
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      router.push('/dashboard/config');
      toast({
        title: 'Success!',
        description: `Configuration ${method === 'PUT' ? 'updated' : 'created'} successfully.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error!',
        description: 'There was a problem saving the configuration.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Heading title="Configuration" description="Set or update the configuration settings below." />
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="minWithdrawalAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Withdrawal Amount</FormLabel>
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
            name="withdrawalFeePercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Withdrawal Fee Percentage</FormLabel>
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
            name="minBalance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Balance</FormLabel>
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
            name='initialBal'
            render={({ field }) => (
              <FormItem>
                <FormLabel>initalbal Balance</FormLabel>
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
            name="level1Percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level 1 Percentage</FormLabel>
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
            name="level2Percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level 2 Percentage</FormLabel>
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
            name="level3Percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level 3 Percentage</FormLabel>
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
            name="linkLifetime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link Lifetime (days)</FormLabel>
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
          <Button type="submit" disabled={loading} className="ml-auto">
            Save changes
          </Button>
        </form>
      </Form>
    </div>
  );
};
