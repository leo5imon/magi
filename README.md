# Magi

### Meme search engine for the real shitposters.

## Features
- Dropzone upload.
- File storage on S3.
- Automatic tagging based on a prompt & the Llava 13B model from Replicate.
- Instant search with any keyword.
- Preview the image in full width by clicking it.

## Preview
![Main page](https://i.ibb.co/mh7k754/GDq-Ff-F3-WQAAp9q-N.jpg")
![Query : uwu](https://i.ibb.co/58DvfRk/GDq-Fl9-ZXc-AAm3gd.jpg)
![Query : cat](https://i.ibb.co/NsgsHcQ/GDq-Fmjz-Wc-AAQj-Pe.jpg)

## Tech Stack
- Next.Js
- AWS S3
- Axios
- Formidable
- Replicate
- Typesense
- Dropzone
- Tailwind with shadcn/ui

## Installation
**To use Magi, follow these steps:**

```
git clone https://github.com/leo5imon/magi.git
npm install
```

Then, get your AWS public & private key from https://aws.amazon.com/fr/.
For the search engine, I'm using TypeSense but feel free to use Algolia or anything : https://cloud.typesense.org/.
Generate a Replicate API Key from https://replicate.com/.

.env example :
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
REPLICATE_API_TOKEN
TYPESENSE_API_KEY
TYPESENSE_API_SEARCH_ONLY
TYPESENSE_HOST
```

## Contribution
_Contributions are welcome!_
If you would like to contribute to Magi, please follow these steps:

- Fork the repository.
- Create a new branch for your feature or bug fix.
- Make your changes and commit them.
- Push your changes to your forked repository.
- Submit a pull request to the main repository.
