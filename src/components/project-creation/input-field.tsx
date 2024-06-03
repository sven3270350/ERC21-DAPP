import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
type Props = {
  form: any;
  name: string;
  label: string;
  placeholder: string;
};

const InputField = ({ form, name, label, placeholder }: Props) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-medium text-[#A1A1AA] text-sm leading-5">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              className="border-[#27272A] bg-[#18181B] border rounded-[6px] placeholder:text-[#71717A]"
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { InputField };
