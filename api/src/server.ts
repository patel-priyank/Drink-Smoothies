import app from './app';

const PORT = process.env.PORT;

if (!PORT || !process.env.DATABASE_URL) {
  throw new Error('Environment variables are not defined.');
}

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});
