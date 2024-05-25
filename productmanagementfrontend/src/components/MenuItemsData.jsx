import { faShoppingBag, faTags, faAddressCard } from '@fortawesome/free-solid-svg-icons';

export const menuItemsData = [
  {
    id: 'menu1',
    icon: faShoppingBag,
    title: 'VENTE',
    links: [
      { to: '/', label: 'Devis' },
      { to: '/facture', label: 'Facture' }
    ]
  },
  {
    id: 'menu2',
    icon: faTags,
    title: 'PRODUIT',
    links: [
      { to: '/', label: 'Article' },
      { to: '/', label: 'Service' }
    ]
  },
  {
    id: 'menu3',
    icon: faAddressCard,
    title: 'CONTACT',
    links: [
      { to: '/', label: 'Client' },
      { to: '/', label: 'Fournisseur' }
    ]
  }
];
