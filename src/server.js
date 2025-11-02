require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 10000;

// Default route
app.get('/', (req, res) => {
  res.send('✅ Relay WMS Backend is running successfully!');
});

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
