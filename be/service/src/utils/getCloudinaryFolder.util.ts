export const getCloudinaryFolder = (role: string | undefined): string | null => {
  let folder = "book-bus-ticket/image";

  switch (role) {
    case "customer":
      return `${folder}/customer/avatar`;
    case "driver":
      return `${folder}/driver/avatar`;
    case "staff":
      return `${folder}/staff/avatar`;
    default:
      return `${folder}/car`;
  }
};
