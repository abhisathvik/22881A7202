const generateShortcode = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

const isValidShortcode = (code) => /^[a-zA-Z0-9]{4,10}$/.test(code);

module.exports = { generateShortcode, isValidShortcode };
