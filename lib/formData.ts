import { ProductFormData } from "@/lib/validation";

export function createProductFormData(data: ProductFormData): FormData {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("out_price", String(data.out_price));
  formData.append("count_type", data.count_type);
  formData.append("in_stock", String(data.in_stock));
  formData.append("currency", data.currency);
  formData.append("category", data.category);

  data.stock.forEach((item, index) => {
    formData.append(`stock[${index}][quantity]`, String(item.quantity));
    formData.append(`stock[${index}][unit_price]`, String(item.unit_price));
    formData.append(`stock[${index}][currency]`, item.currency);
    formData.append(`stock[${index}][is_warehouse]`, String(item.is_warehouse));
  });

  data.properties?.forEach((prop, index) => {
    formData.append(`properties[${index}][feature]`, prop.feature);
    formData.append(`properties[${index}][value]`, prop.value);
  });

  data.images?.forEach((img) => {
    formData.append("images", img.image);
  });

  // Log the FormData contents
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  return formData;
}
