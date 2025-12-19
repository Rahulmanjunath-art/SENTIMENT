
import { Review, Product } from './types';

export const mockProduct: Product = {
  id: 'p1',
  name: 'RevieAI Pro Wireless Headphones',
  brand: 'Acoustix',
  description: 'Experience studio-quality sound with adaptive noise cancellation and 40-hour battery life.',
  price: 299.99,
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000',
  category: 'Electronics',
  averageRating: 4.8,
  totalReviews: 124
};

export const initialReviews: Review[] = [
  {
    id: '1',
    author: 'Sarah Jenkins',
    rating: 5,
    date: 'March 12, 2024',
    title: 'Crystal Clear Audio!',
    comment: 'The noise cancellation on these is absolutely incredible. I use them for my daily commute and the train sounds completely disappear. Battery life is as advertised.',
    sentiment: 'positive',
    likes: 42,
    avatar: 'https://picsum.photos/seed/sarah/100/100'
  },
  {
    id: '2',
    author: 'Michael Chen',
    rating: 4,
    date: 'February 28, 2024',
    title: 'Solid build, slightly heavy',
    comment: 'Great sound stage and the bass is punchy without being muddy. My only complaint is they feel a bit heavy after wearing them for more than 3 hours.',
    sentiment: 'neutral',
    likes: 15,
    avatar: 'https://picsum.photos/seed/michael/100/100'
  },
  {
    id: '3',
    author: 'David Rodriguez',
    rating: 2,
    date: 'January 15, 2024',
    title: 'Bluetooth issues',
    comment: 'The sound is okay but I keep experiencing drops in connection when my phone is in my pocket. Re-pairing helps but it happens at least once a day.',
    sentiment: 'negative',
    likes: 8,
    avatar: 'https://picsum.photos/seed/david/100/100',
    merchantReply: 'We are sorry to hear about your connection issues, David. Our latest firmware update addresses Bluetooth stability. Please check the Acoustix app for updates!'
  }
];
