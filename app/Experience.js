'use client';
import { useEffect } from 'react';
import { mountExperience } from '../src/experience/index.mjs';

export default function Experience() {
  useEffect(() => {
    const root = document.getElementById('experience');
    return root ? mountExperience(root) : undefined;
  }, []);
  return null;
}
