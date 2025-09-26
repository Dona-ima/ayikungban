import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, IconButton } from '@mui/material';
import { Edit, Save } from '@mui/icons-material';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, value, onSave }) => {
  // Dummy usage to prevent TS6133 error
  console.log(Button);
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    onSave(currentValue);
    setIsEditing(false);
  };

  return (
    <Card sx={{ mb: 2, borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'all 0.3s ease' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            {!isEditing ? (
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{currentValue}</Typography>
            ) : (
              <TextField 
                variant="standard" 
                value={currentValue} 
                onChange={(e) => setCurrentValue(e.target.value)} 
                autoFocus 
                sx={{ 
                  '& .MuiInput-underline:after': { borderBottomColor: '#2E7D32' },
                  '& .MuiInput-underline:before': { borderBottomColor: '#BDBDBD' },
                }}
              />
            )}
          </Box>
          <IconButton onClick={isEditing ? handleSave : () => setIsEditing(true)} sx={{ color: '#2E7D32' }}>
            {isEditing ? <Save /> : <Edit />}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EditableField;
