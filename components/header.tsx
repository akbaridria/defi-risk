import { GithubIcon, ShieldBanIcon } from "lucide-react";
import { ThemeChanger } from "./theme-changer";
import { Button } from "./ui/button";
import Link from "next/link";

const Header = () => {
	return (
		<div className="border-b sticky top-0 p-4 bg-background/80 backdrop-blur-sm z-50">
			<div className="container mx-auto flex items-center justify-between">
				<Link href="/" className="flex items-center space-x-2">
					<ShieldBanIcon size={24} />
					<div className="text-2xl font-semibold tracking-tight">DefiRisk</div>
				</Link>
				<div className="flex items-center space-x-2">
					<Button variant="ghost" size="icon">
						<GithubIcon />
					</Button>
					<ThemeChanger />
				</div>
			</div>
		</div>
	);
};

export default Header;
