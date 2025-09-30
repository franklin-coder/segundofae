export const SUBCATEGORIES = {
  earrings: ['Crochet', 'Beaded', 'Resin'],
  necklaces: ['Crochet', 'Beaded'],
  bracelets: ['Beaded', 'Crochet'],
  rings: [],
}

export const getSubcategoriesForCategory = (category: string): string[] => {
  const categoryKey = category as keyof typeof SUBCATEGORIES
  return SUBCATEGORIES[categoryKey] || []
}