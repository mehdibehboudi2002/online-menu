import { MenuItem } from './api';

export interface CartItem extends MenuItem {
    quantity: number;
}