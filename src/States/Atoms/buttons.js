import { atom } from 'recoil';

const productDialogAtom = atom({
    key: 'productDialog',
    default: false
});

const fournisseurDialogAtom = atom({
    key: 'FournisseurDialog',
    default: false
});

const categorieDialogAtom = atom({
    key: 'categorieDialog',
    default: false
});

const stockDialogAtom = atom({
    key: 'stockDialog',
    default: false
});

export { 
    productDialogAtom,
    fournisseurDialogAtom,
    categorieDialogAtom,
    stockDialogAtom,
};