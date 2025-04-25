const testEmail = (email: string) => {
  const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.(com|vn|org|edu|net)$/;
  return reg.test(email);
};

export default testEmail;
