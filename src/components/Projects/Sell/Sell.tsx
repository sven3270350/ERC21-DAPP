import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import styles from '../../newproject/checkbox.module.css';

interface Invoice {
    Number: string;
    Address: string;
    EthBalance: string;
    TokenBalance: string;
    Estimate: string;
}

export const Sell: React.FC = () => {
    const invoices: Invoice[] = [
        {
            Number: "1",
            Address: "0x1f9090aaE28b....28e676c326 ",
            EthBalance: "0.00036",
            TokenBalance: "0.00036",
            Estimate: "0.00034"
        },
        {
            Number: "2",
            Address: "0x1f9090aaE28b....28e676c326 ",
            EthBalance: "0.00036",
            TokenBalance: "0.00036",
            Estimate: "0.00034"
        },
        {
            Number: "3",
            Address: "0x1f9090aaE28b....28e676c326 ",
            EthBalance: "0.00036",
            TokenBalance: "0.00036",
            Estimate: "0.00034"
        },
    ];

    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

    const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedInvoices(invoices.map(invoice => invoice.Number));
        } else {
            setSelectedInvoices([]);
        }
    };

    const handleSelectOne = (event: ChangeEvent<HTMLInputElement>, invoiceNumber: string) => {
        if (event.target.checked) {
            setSelectedInvoices(prev => [...prev, invoiceNumber]);
        } else {
            setSelectedInvoices(prev => prev.filter(number => number !== invoiceNumber));
        }
    };

    const isSelected = (invoiceNumber: string) => selectedInvoices.includes(invoiceNumber);

    return (
        <div>
            <Table className='border-[1px] border-[#18181B] rounded-md'>
                <TableHeader className='bg-[#18181B]'>
                    <TableRow className='hover:bg-inherit border-none'>
                        <TableHead>
                            <input
                                type="checkbox"
                                className={styles.checkbox}
                                onChange={handleSelectAll}
                                checked={selectedInvoices.length === invoices.length}
                            />
                        </TableHead>
                        <TableHead className='text-[12px] text-center'>#</TableHead>
                        <TableHead className='text-[12px] text-center'>ADDRESS</TableHead>
                        <TableHead className='text-[12px] text-center'>ETH BALANCE</TableHead>
                        <TableHead className='text-[12px] text-center'>TOKEN BALANCE</TableHead>
                        <TableHead className='text-[12px] text-center'>% TO SELL</TableHead>
                        <TableHead className='text-[12px] text-center'>ESTIMATED ETH</TableHead>
                        <TableHead className='text-[12px] text-center'>TRANSFER TO TARGET</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice, index) => (
                        <TableRow key={invoice.Number} className={`hover:bg-inherit py-0 border-none text-center ${index % 2 === 1 ? 'bg-[#18181B]' : ''}`}>
                            <TableCell className='py-0'>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={isSelected(invoice.Number)}
                                    onChange={(event) => handleSelectOne(event, invoice.Number)}
                                />
                            </TableCell>
                            <TableCell className='text-[#A1A1AA] text-[12px]'>{invoice?.Number}</TableCell>
                            <TableCell className='py-0'>
                                <div className='text-[#71717A] flex gap-1 items-center text-[12px]'>
                                    {invoice.Address}
                                    <Image
                                        src={"/copy-01.svg"}
                                        width={15}
                                        height={15}
                                        alt="Copy"
                                    />
                                </div>
                            </TableCell>
                            <TableCell className='py-0'>
                                <div className='text-[#F57C00] flex gap-1 items-center text-[12px]'>
                                    <Image
                                        src={"/Vector.svg"}
                                        width={15}
                                        height={15}
                                        alt="ETH"
                                    />
                                    {invoice?.EthBalance}
                                </div>
                            </TableCell>
                            <TableCell className='py-0'>
                                <div className='text-[#A1A1AA] flex gap-1 items-center text-[12px]'>
                                    <Image
                                        src={"/coins-01.svg"}
                                        width={15}
                                        height={15}
                                        alt="Token"
                                    />
                                    {invoice?.TokenBalance}
                                </div>
                            </TableCell>
                            <TableCell className='w-[150px] py-0'>
                                <Input
                                    className="bg-[#18181B] h-8 border-[#27272A] mt-2 text-white text-center text-[12px]"
                                    placeholder="Amount"
                                    type="number"
                                    required
                                />
                            </TableCell>
                            <TableCell className='py-0 text-[#A1A1AA] text-[12px]'>{invoice?.Estimate}</TableCell>
                            <TableCell className=' py-0'>
                                <input
                                    type="checkbox"
                                    className={`${styles.checkbox}`}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
