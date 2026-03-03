import capitalize from '@/utils/capitalize';

export const MODULE_NAME = 'products';

export const CARD_DATA = {
  title: capitalize(MODULE_NAME),
  description: `Manage your ${MODULE_NAME} and their details here.`,
  addButton: {
    label: `Add New ${capitalize(MODULE_NAME)}`,
  },
};
