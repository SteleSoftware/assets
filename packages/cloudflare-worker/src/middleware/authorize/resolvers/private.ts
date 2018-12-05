export default () => new Response(null, {
  status: 403,
  statusText: 'Access to private asset not allowed',
});
