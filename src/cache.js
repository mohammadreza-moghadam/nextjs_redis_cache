import { redis } from "./redis";

const fetch = async (key, fetcher, expires) => {
  const existingValue = await get(key)
  if (existingValue !== null) return existingValue
  return set(key, fetcher, expires)
}

const get = async (key) => {
  const value = await redis.get(key)
  if (value === null) return null
  return JSON.parse(value)
}

const set = async (key, fetcher, expires) => {
  const value = await fetcher()
  await redis.set(key, JSON.stringify(value), "EX", expires)
  return value
}

const del = async (key) => {
  await redis.del(key)
}

export default {fetch, set, get, del};