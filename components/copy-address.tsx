import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const formatAddress = (address: string) =>
	`${address.slice(0, 6)}...${address.slice(-4)}`;

const CopyAddress: React.FC<{ text: string }> = ({ text }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 1000);
	};

	return (
		<div className="flex items-center gap-1">
			<div>{formatAddress(text)}</div>
			<Button
				size="icon"
				onClick={handleCopy}
				variant="ghost"
				className="w-6 h-6"
			>
				{copied ? <Check size={8} /> : <Copy size={8} />}
			</Button>
		</div>
	);
};

export default CopyAddress;
