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
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
};

const InputField = ({ form, name, label, placeholder, type, disabled, readOnly }: Props) => {
  return (
    <FormField
      control={form.control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-medium text-[#A1A1AA] text-sm leading-5">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              type={type ? "number" : "text"}
              className="border-[#27272A] bg-[#18181B] border rounded-[6px] placeholder:text-[#71717A]"
              placeholder={placeholder}
              {...field}
              onChange={(e) => field.onChange(e.target.value)}
              readOnly={readOnly} // Pass readOnly to the Input element
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { InputField };
