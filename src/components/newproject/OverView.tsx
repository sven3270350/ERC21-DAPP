import Image from "next/image";

interface Wallet {
    name: string;
    publicKey: string;
    privateKey: string;
}

const Overview: React.FC = () => {
    const wallets: Wallet[] = [
        {
            name: 'Funding Wallet',
            publicKey: "afdfd9c3d2095ef6 96594f6cedcae59 e72dcd697e2a7521b1578140422a4f890",
            privateKey: "**************************************** ***************************************"
        },
        {
            name: 'Admin Wallet',
            publicKey: "afdfd9c3d2095ef6 96594f6cedcae59 e72dcd697e2a7521b1578140422a4f890",
            privateKey: "**************************************** ***************************************"
        }
    ];

    const renderWallets = (): JSX.Element[] => {
        return wallets.map((wallet: Wallet, index: number) => (
            <div key={index} className='border-dashed border-[1px] border-[#27272A] px-6 py-4 w-[320px]'>
                <h2 className="text-xl font-semibold text-white text-center mb-2">{wallet.name}</h2>
                {renderKeys(wallet)}
            </div>
        ));
    };

    const renderKeys = (wallet: Wallet): JSX.Element => {
        return (
            <>
                <div className='mb-4'>
                    <h2 className="text-base font-semibold text-white text-center mb-2">Public Key</h2>
                    <p className="text-[#71717A] text-xs font-medium text-start">{wallet.publicKey}</p>
                    {renderKeyActions()}
                </div>
                <div className='mb-4'>
                    <h2 className="text-base font-semibold text-white text-center mb-2">Private Key</h2>
                    <p className="text-[#71717A] text-xs font-medium text-start">{wallet.privateKey}</p>
                    {renderKeyActions()}
                </div>
            </>
        );
    };

    const renderKeyActions = (): JSX.Element => {
        return (
            <div className='flex gap-2 '>
                <Image
                    src={"./Images/New Project/copy-01.svg"}
                    width={16}
                    height={16}
                    alt="logo"
                    className='cursor-pointer'
                />
                <Image
                    src={"./Images/New Project/download-02.svg"}
                    width={16}
                    height={16}
                    alt="logo"
                    className='cursor-pointer'
                />
            </div>
        );
    };

    const array1 = [
        {
            price: 'OpSec',
            name: 'Name'
        },
        {
            price: 'OpSec',
            name: 'Token Name'
        },
        {
            price: '10,000,000',
            name: 'Max supply'
        },
        {
            price: '10,000,000',
            name: 'Initial supply'
        },
    ];

    const array2 = [
        {
            price: '5,00,000',
            name: 'Liquidity'
        },
        {
            price: '$0.020',
            name: 'Trading price'
        },
        {
            price: '10,000,000',
            name: 'Max supply'
        },
        {
            price: '10,000,000',
            name: 'Initial supply'
        },
    ];

    return (
        <section>
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-white text-center mb-2">Overview</h2>
                <p className="text-[#71717A] text-sm font-medium text-center mb-4">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam</p>
                <div className="grid grid-cols-4 justify-between mb-4">
                    {array1.map((item, index) => (
                        <div key={index}>
                            <h4 className="font-medium text-[16px] text-white">{item.price}</h4>
                            <p className="text-[#71717A] text-sm font-medium ">{item.name}</p>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-4 justify-between mb-4">
                    {array2.map((item, index) => (
                        <div key={index}>
                            <h4 className="font-medium text-[16px] text-white">{item.price}</h4>
                            <p className="text-[#71717A] text-sm font-medium ">{item.name}</p>
                        </div>
                    ))}
                </div>
                <div className='flex gap-4 mb-4'>
                    {renderWallets()}
                </div>
                <h2 className="text-xl font-semibold text-white text-start mb-2">Beneficiaries</h2>
                <div className="flex justify-between mb-4">
                    <div>
                        <h4 className="font-medium text-[16px] text-white">0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367</h4>
                        <p className="text-[#71717A] text-sm font-medium ">Wallet address</p>
                    </div>
                    <div>
                        <h4 className="font-medium text-[16px] text-white">150,000</h4>
                        <p className="text-[#71717A] text-sm font-medium ">Supply of token</p>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div>
                        <h4 className="font-medium text-[16px] text-white">0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367</h4>
                        <p className="text-[#71717A] text-sm font-medium ">Wallet address</p>
                    </div>
                    <div>
                        <h4 className="font-medium text-[16px] text-white">150,000</h4>
                        <p className="text-[#71717A] text-sm font-medium ">Supply of token</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Overview;
