import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WalletSectionProps {
    title: string;
    buttonText: string;
    showContent: boolean;
    onButtonClick: () => void;
    publicKey: string;
    privateKey: string;
}

const WalletSection: React.FC<WalletSectionProps> = ({ title, buttonText, showContent, onButtonClick, publicKey, privateKey }) => {
    const handlePublicKeyCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(publicKey)
                .then(() => {
                    console.log('Public key copied to clipboard');
                })
                .catch((error) => {
                    console.error('Failed to copy public key:', error);
                });
        } else {
            console.error('Clipboard API not available');
        }
    };

    const handleDownloadClick = () => {
        const filename = 'wallet_keys.txt';
        const keysContent = `Public Key: ${publicKey}\nPrivate Key: ${privateKey}`;
        const element = document.createElement('a');
        const file = new Blob([keysContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element); // Required for Firefox
        element.click();
        document.body.removeChild(element);
    };

    const handlePrivateKeyCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(privateKey)
                .then(() => {
                    console.log('Private key copied to clipboard');
                })
                .catch((error) => {
                    console.error('Failed to copy private key:', error);
                });
        } else {
            console.error('Clipboard API not available');
        }
    };

    return (
        <div className='border-dashed border-[1px] border-[#27272A] px-6 py-4 w-[320px]'>
            <h2 className="text-xl font-semibold text-white text-center mb-2">{title}</h2>
            <p className="text-[#71717A] text-sm font-medium text-center mb-16">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam</p>
            {!showContent && (
                <Button className="bg-black text-[#F57C00] text-base font-semibold flex gap-2 w-[280px] border-[1px] border-[#F57C00]" onClick={onButtonClick}>
                    <Image
                        src={"/Images/New Project/add-01.svg"}
                        width={14}
                        height={14}
                        alt="logo"
                    />
                    {buttonText}
                </Button>
            )}
            {showContent && (
                <div>
                    <div className='mb-4'>
                        <h2 className="text-base font-semibold text-white text-center mb-2">Public Key</h2>
                        <div>
                            <p className="text-[#71717A] text-xs font-medium text-start">{publicKey}</p>
                            <div className='flex gap-2'>
                                <Image
                                    src={"/Images/New Project/copy-01.svg"}
                                    width={16}
                                    height={16}
                                    alt="logo"
                                    onClick={handlePublicKeyCopy}
                                    className='cursor-pointer'
                                />
                                <Image
                                    src={"/Images/New Project/download-02.svg"}
                                    width={16}
                                    height={16}
                                    alt="logo"
                                    onClick={handleDownloadClick}
                                    className='cursor-pointer'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='mb-4'>
                        <h2 className="text-base font-semibold text-white text-center mb-2">Private Key</h2>
                        <div>
                            <Input type='password' className='bg-[#09090B] border-0 text-[#71717A] text-xs font-medium' value={privateKey} />
                            <div className='flex gap-2'>
                                <Image
                                    src={"/Images/New Project/copy-01.svg"}
                                    width={16}
                                    height={16}
                                    alt="logo"
                                    onClick={handlePrivateKeyCopy}
                                    className='cursor-pointer'
                                />
                                <Image
                                    src={"/Images/New Project/download-02.svg"}
                                    width={16}
                                    height={16}
                                    alt="logo"
                                    onClick={handleDownloadClick}
                                    className='cursor-pointer'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletSection;
