const express = require("express");
const app = express();

// Init Middleware
app.use(express.json({ extended: false }));

app.use("/api/register", require("./routes/register"));
app.use("/api/auth", require("./routes/auth"));

// app.use(
//   "/graphql",
//   graphqlHTTP({
//     schema: schema,
//     graphiql: true,
//   })
// );

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is listening at PORT: ${PORT}`));
