const { PrismaClient } = require('@prisma/client');
const client = new PrismaClient();
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/todos', async(req, res, next)=> {
  try {
    res.send(await client.todo.findMany());
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/todos/:id', async(req, res, next)=> {
  try {
    await client.todo.delete({
      where: {
        id: req.params.id*1
      }
    });
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.put('/api/todos/:id', async(req, res, next)=> {
  try {
    const todo = await client.todo.update({
      data: {
        isComplete: req.body.isComplete
      },
      where: {
        id: req.params.id*1
      }
    });
    res.send(todo);
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/todos', async(req, res, next)=> {
  try {
    const todo = await client.todo.create({
      data: {
        name: req.body.name
      },
    });
    res.send(todo);
  }
  catch(ex){
    next(ex);
  }
});

app.use((req, res, next)=> {
  const error = Error('page not found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message || err});
});

const init = async()=> {
  await client.todo.deleteMany({});
  const foo = await client.todo.create({
    data: {
      name: 'foo'
    }
  });
  const bar = await client.todo.create({
    data: {
      name: 'bar',
      isComplete: true
    }
  });
  const todos = await client.todo.findMany();
  console.log(todos);
  const port = process.env.PORT || 3000;
  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
  });
};

init();
