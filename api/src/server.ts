import 'reflect-metadata'

import express from 'express'
import routes from './routes'

import './database';

const app = express()

app.use(express.json())
app.use(routes)

app.listen(3334, () => {
	console.log('Init API on port 3334')
})
