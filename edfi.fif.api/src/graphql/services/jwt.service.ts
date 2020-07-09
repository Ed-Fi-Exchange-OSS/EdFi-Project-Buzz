// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getClaims = (bearerToken: string) => {
  const token = bearerToken.split(' ')[1];
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    Buffer.from(base64, 'base64')
      .toString()
      .split('')
      .map(c => {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
};

export default getClaims;
