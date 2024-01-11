/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image-tag.s3.eu-west-3.amazonaws.com",
      },
    ],
}
}