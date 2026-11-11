import fs from 'fs/promises';
import path from 'path';
import { IProperty, IComment } from '@/types/property';
import { defaultProperties } from './defaultData';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json');
const FEEDBACKS_FILE = path.join(DATA_DIR, 'feedbacks.json');
const LIKES_FILE = path.join(DATA_DIR, 'likes.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {}
}

export async function getStoredProperties(): Promise<IProperty[]> {
  await ensureDataDir();
  try {
    const content = await fs.readFile(PROPERTIES_FILE, 'utf-8');
    const data = JSON.parse(content);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (e) {
    // If file doesn't exist or is invalid, seed with defaults
  }

  // Seed default properties to disk
  await fs.writeFile(PROPERTIES_FILE, JSON.stringify(defaultProperties, null, 2), 'utf-8');
  return defaultProperties;
}

export async function getStoredPropertyById(id: string): Promise<IProperty | null> {
  const properties = await getStoredProperties();
  const match = properties.find((p) => p.id === id || p._id === id);
  return match || null;
}

export async function saveStoredProperty(newProp: IProperty): Promise<IProperty> {
  const properties = await getStoredProperties();
  const propertyToSave: IProperty = {
    ...newProp,
    id: newProp.id || Date.now().toString(),
    createdAt: newProp.createdAt || new Date().toISOString(),
  };

  const updatedList = [propertyToSave, ...properties];
  await ensureDataDir();
  await fs.writeFile(PROPERTIES_FILE, JSON.stringify(updatedList, null, 2), 'utf-8');
  return propertyToSave;
}

export async function updateStoredProperty(id: string, updates: Partial<IProperty>): Promise<IProperty | null> {
  const properties = await getStoredProperties();
  const index = properties.findIndex((p) => p.id === id || p._id === id);
  if (index === -1) return null;

  const updated: IProperty = {
    ...properties[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  properties[index] = updated;
  await ensureDataDir();
  await fs.writeFile(PROPERTIES_FILE, JSON.stringify(properties, null, 2), 'utf-8');
  return updated;
}

export async function deleteStoredProperty(id: string): Promise<boolean> {
  const properties = await getStoredProperties();
  const filtered = properties.filter((p) => p.id !== id && p._id !== id);
  if (filtered.length === properties.length) return false;

  await ensureDataDir();
  await fs.writeFile(PROPERTIES_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}

// Like counters storage
export async function updateStoredLike(propertyId: string, action: 'like' | 'unlike'): Promise<number> {
  await ensureDataDir();
  let likesMap: Record<string, number> = {};
  try {
    const raw = await fs.readFile(LIKES_FILE, 'utf-8');
    likesMap = JSON.parse(raw);
  } catch (e) {}

  const current = likesMap[propertyId] !== undefined ? likesMap[propertyId] : 18;
  const nextVal = action === 'unlike' ? Math.max(0, current - 1) : current + 1;
  likesMap[propertyId] = nextVal;

  await fs.writeFile(LIKES_FILE, JSON.stringify(likesMap, null, 2), 'utf-8');

  // Also sync property object likes count
  try {
    await updateStoredProperty(propertyId, { likes: nextVal });
  } catch (e) {}

  return nextVal;
}

// Comments storage
export async function addStoredComment(propertyId: string, comment: IComment): Promise<IComment[]> {
  const properties = await getStoredProperties();
  const index = properties.findIndex((p) => p.id === propertyId || p._id === propertyId);

  if (index !== -1) {
    const prop = properties[index];
    const comments = prop.comments || [];
    comments.unshift(comment);
    prop.comments = comments;
    await ensureDataDir();
    await fs.writeFile(PROPERTIES_FILE, JSON.stringify(properties, null, 2), 'utf-8');
    return comments;
  }

  return [comment];
}

export async function getStoredComments(propertyId: string): Promise<IComment[]> {
  const prop = await getStoredPropertyById(propertyId);
  return prop?.comments || [];
}

// Feedbacks storage
export interface IStoredFeedback {
  id: string;
  name: string;
  contact: string;
  category: string;
  rating: number;
  message: string;
  createdAt: string;
}

export async function getStoredFeedbacks(): Promise<IStoredFeedback[]> {
  await ensureDataDir();
  try {
    const content = await fs.readFile(FEEDBACKS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return [];
  }
}

export async function saveStoredFeedback(feedback: Omit<IStoredFeedback, 'id' | 'createdAt'>): Promise<IStoredFeedback> {
  const feedbacks = await getStoredFeedbacks();
  const newFeedback: IStoredFeedback = {
    ...feedback,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  const updated = [newFeedback, ...feedbacks];
  await ensureDataDir();
  await fs.writeFile(FEEDBACKS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return newFeedback;
}
