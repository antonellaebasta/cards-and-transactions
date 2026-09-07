export const formatCardId = (id: string): string => {
  const alphanumeric = id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return alphanumeric.match(/.{1,4}/g)?.join(" ") ?? alphanumeric;
};
