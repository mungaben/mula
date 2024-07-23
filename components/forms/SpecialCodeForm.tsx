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
import { useToast } from '@/components/ui/use-toast';
import { specialCodeSchema } from '@/lib/schemas';

// Extend the schema to include id
const specialCodeFormSchema = specialCodeSchema.extend({
  id: z.string().optional(),
  expiresAt: z.date(), // Make sure the schema expects a Date object for expiresAt
});

export type SpecialCodeFormValues = z.infer<typeof specialCodeFormSchema>;

interface SpecialCodeFormProps {
  initialData?: SpecialCodeFormValues;
  codeId?: string;
}

export const SpecialCodeForm: React.FC<SpecialCodeFormProps> = ({ initialData, codeId }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<SpecialCodeFormValues>({
    resolver: zodResolver(specialCodeFormSchema),
    defaultValues: initialData || {
      totalAmount: 0,
      redeemAmount: 0,
      expiresAt: new Date(), // Use a Date object here
      userId: undefined,
    },
  });

  const onSubmit = async (data: SpecialCodeFormValues, method: 'POST' | 'PUT') => {
    try {
      setLoading(true);
      const url = method === 'POST' ? '/api/special-code/create' : `/api/special-code/create/${data.id}`;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          expiresAt: data.expiresAt.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${method === 'POST' ? 'create' : 'update'} special code`);
      }

      router.push('/dashboard/special-code');
      toast({
        title: 'Success!',
        description: `Special code ${method === 'POST' ? 'created' : 'updated'} successfully.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error!',
        description: `There was a problem ${method === 'POST' ? 'creating' : 'updating'} the special code.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Heading title={codeId ? 'Edit Special Code' : 'Create Special Code'} description="Enter the details of the special code below." />
      <Separator />
      <Form {...form}>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <FormField
            control={form.control}
            name="totalAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Amount</FormLabel>
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
            name="redeemAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Redeem Amount</FormLabel>
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
            name="expiresAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expires At</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    onChange={(e) => field.onChange(new Date(e.target.value))} // Convert to Date object
                    disabled={loading}
                    value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''} // Convert Date object to string
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex space-x-4">
            <Button type="button" onClick={() => form.handleSubmit((data) => onSubmit(data, 'POST'))()} disabled={loading}>
              Create
            </Button>
            <Button type="button" onClick={() => form.handleSubmit((data) => onSubmit(data, 'PUT'))()} disabled={loading}>
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
