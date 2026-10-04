import redis from "../config/redis.js";

export const getCache = async (key) => {
  try {
    const value = await redis.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error("Cache get error: ", error.message);
    return null;
  }
};

export const setCache = async (key, value, ttlSeconds = 60) => {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (error) {
    console.error("Cache set error: ", error.message);
  }
};

export const deleteCache = async (key) => {
  try {
    await redis.del(key);
  } catch (error) {
    console.error("Cache delete error: ", error.message);
  }
};
