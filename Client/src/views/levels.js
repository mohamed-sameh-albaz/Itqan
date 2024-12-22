import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Typography, IconButton } from '@material-tailwind/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { requestAPI, useAPI } from '../hooks/useAPI';
import CommunityNavBar from '../components/CommunityNavBar';
import { DefaultPagination } from '../components/Paginator';

const Levels = () => {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLevel, setEditingLevel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    pointsThreshold: '',
    reward_id: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [levelResponse, isLevelLoading, refreshLevels] = useAPI('/levels', 'get', { params: { page: currentPage, limit: 10 } });

  useEffect(() => {
    refreshLevels();
  }, [currentPage]);

  useEffect(() => {
    if (!isLevelLoading && levelResponse) {
      setLevels(levelResponse.data.levels);
      setTotalPages(Math.ceil(levelResponse.pagination.total / levelResponse.pagination.per_page));
      setLoading(false);
    }
  }, [levelResponse, isLevelLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { status, data } = editingLevel
      ? await requestAPI(`/levels/${editingLevel.id}`, 'put', { body: formData })
      : await requestAPI('/levels', 'post', { body: formData });

    if (status >= 200 && status < 300) {
      alert(editingLevel ? 'Level updated successfully' : 'Level added successfully');
      setFormData({ name: '', pointsThreshold: '', reward_id: '' });
      setEditingLevel(null);
      refreshLevels();
    } else {
      alert('Failed to save level');
    }
    setLoading(false);
  };

  const handleEdit = (level) => {
    setEditingLevel(level);
    setFormData(level);
  };

  const handleDelete = async (levelId) => {
    setLoading(true);
    const { status } = await requestAPI(`/levels/${levelId}`, 'delete');
    if (status >= 200 && status < 300) {
      alert('Level deleted successfully');
      refreshLevels();
    } else {
      alert('Failed to delete level');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CommunityNavBar />
      <div className="container mx-auto mt-5">
        <Typography variant="h4" className="mb-4">Manage Levels</Typography>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Points Threshold"
              name="pointsThreshold"
              type="number"
              value={formData.pointsThreshold}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Reward ID"
              name="reward_id"
              type="number"
              value={formData.reward_id}
              onChange={handleInputChange}
            />
          </div>
          <Button type="submit" className="mt-4" disabled={loading}>
            {editingLevel ? 'Update Level' : 'Add Level'}
          </Button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p>Loading levels...</p>
          ) : (
            levels.map((level) => (
              <Card key={level.id} className="p-4">
                <Typography variant="h6">{level.name}</Typography>
                <Typography variant="small">Points Threshold: {level.pointsthreshold}</Typography>
                <Typography variant="small">Reward ID: {level.reward_id}</Typography>
                <div className="flex justify-end mt-4">
                  <IconButton variant="text" onClick={() => handleEdit(level)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </IconButton>
                  <IconButton variant="text" onClick={() => handleDelete(level.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </div>
              </Card>
            ))
          )}
        </div>
        <div className="mt-4">
          <DefaultPagination totalPages={totalPages} active={currentPage} setActive={setCurrentPage} />
        </div>
      </div>
    </div>
  );
};

export default Levels;