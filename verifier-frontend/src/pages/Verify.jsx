import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomButton as Button } from './Components/CustomButton.tsx';
import { CustomCard } from './Components/CustomCard.tsx';
import { CustomForm } from './Components/CustomForm.tsx';
import { useNavigate } from 'react-router-dom';

export const Verify = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Verify Page</h1>
    </div>
  );
};
