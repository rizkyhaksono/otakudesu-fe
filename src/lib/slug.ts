function convertToSlug(urlEncodedText: string) {
  const decodedText = decodeURIComponent(urlEncodedText);
  return decodedText
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, ''); 
}

export default convertToSlug