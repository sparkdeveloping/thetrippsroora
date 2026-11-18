/** @type {import('next').NextConfig} */
const config = { poweredByHeader:false, async headers(){return [{source:'/((?!_next/static|_next/image).*)',headers:[{key:'Referrer-Policy',value:'no-referrer'},{key:'X-Content-Type-Options',value:'nosniff'},{key:'X-Frame-Options',value:'DENY'},{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=(), gyroscope=(self), accelerometer=(self)'}]}]}};
export default config;
