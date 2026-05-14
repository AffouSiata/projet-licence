export interface NavCategory {
	label: string;
	slug: string;
	subcategories: { name: string; slug: string }[];
}

export const NAV_CATEGORIES: NavCategory[] = [
	{
		label: "SYSTÈMES D'EXPLOITATION",
		slug: 'systemes-exploitation',
		subcategories: [
			{ name: 'Windows 11', slug: 'windows-11' },
			{ name: 'Windows 10', slug: 'windows-10' },
			{ name: 'Windows 7', slug: 'windows-7' },
			{ name: 'macOS', slug: 'macos' },
		],
	},
	{
		label: 'OFFICE',
		slug: 'office',
		subcategories: [
			{ name: 'Microsoft 365', slug: 'microsoft-365' },
			{ name: 'Office 2024', slug: 'office-2024' },
			{ name: 'Office 2021', slug: 'office-2021' },
			{ name: 'Office 2019', slug: 'office-2019' },
			{ name: 'Office Mac', slug: 'office-mac' },
		],
	},
	{
		label: 'ANTIVIRUS',
		slug: 'antivirus',
		subcategories: [
			{ name: 'Kaspersky', slug: 'kaspersky' },
			{ name: 'Norton', slug: 'norton' },
			{ name: 'Bitdefender', slug: 'bitdefender' },
			{ name: 'ESET NOD32', slug: 'eset' },
			{ name: 'Avast', slug: 'avast' },
		],
	},
	{
		label: 'WINDOWS SERVER',
		slug: 'windows-server',
		subcategories: [
			{ name: 'Server 2022', slug: 'server-2022' },
			{ name: 'Server 2019', slug: 'server-2019' },
			{ name: 'Server 2016', slug: 'server-2016' },
			{ name: 'SQL Server', slug: 'sql-server' },
		],
	},
	{
		label: 'AUTODESK',
		slug: 'autodesk',
		subcategories: [
			{ name: 'AutoCAD 2025', slug: 'autocad-2025' },
			{ name: 'Revit 2025', slug: 'revit-2025' },
			{ name: '3ds Max', slug: '3ds-max' },
			{ name: 'Maya', slug: 'maya' },
			{ name: 'Inventor', slug: 'inventor' },
			{ name: 'Civil 3D', slug: 'civil-3d' },
		],
	},
	{
		label: 'ADOBE',
		slug: 'adobe',
		subcategories: [
			{ name: 'Creative Cloud', slug: 'creative-cloud' },
			{ name: 'Photoshop', slug: 'photoshop' },
			{ name: 'Illustrator', slug: 'illustrator' },
			{ name: 'Premiere Pro', slug: 'premiere-pro' },
			{ name: 'After Effects', slug: 'after-effects' },
			{ name: 'Acrobat Pro', slug: 'acrobat-pro' },
		],
	},
];
