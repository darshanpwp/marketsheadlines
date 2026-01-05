import { getMenu } from '@/lib/wordpress/api';
import { WordPressMenu } from '@/types/wordpress';
import NavbarContent from './NavbarContent';

/**
 * Header component that fetches and displays the main navigation menu from WordPress.
 */
export default async function Header() {
  const menu: WordPressMenu | null = await getMenu('main_menu');
  const menuItems = menu?.items || [];

  return (
    <header className="fixed-top w-100 bg-white border-bottom shadow-sm">
      <NavbarContent menuItems={menuItems} />
    </header>
  );
}
