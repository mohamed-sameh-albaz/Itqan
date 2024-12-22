import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Typography, IconButton } from '@material-tailwind/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { requestAPI, useAPI } from '../hooks/useAPI';
import CommunityNavBar from '../components/CommunityNavBar';
import { DefaultPagination } from '../components/Paginator';

const AddRewards = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReward, setEditingReward] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    type: '',
    name: '',
    image: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [rewardResponse, isRewardLoading, refreshRewards] = useAPI('/rewards', 'get', { params: { page: currentPage, limit: 10 } });

  useEffect(() => {
    refreshRewards();
  },[currentPage])

  useEffect(() => {
    if (!isRewardLoading && rewardResponse) {
      setRewards(rewardResponse.data.rewards);
      setTotalPages(Math.ceil(rewardResponse.pagination.total / rewardResponse.pagination.per_page));
      setLoading(false);
    }
  }, [rewardResponse, isRewardLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { status, data } = editingReward
      ? await requestAPI(`/rewards/${editingReward.id}`, 'put', { body: formData })
      : await requestAPI('/rewards', 'post', { body: formData });

    if (status >= 200 && status < 300) {
      alert(editingReward ? 'Reward updated successfully' : 'Reward added successfully');
      setFormData({ description: '', type: '', name: '', image: '' });
      setEditingReward(null);
      refreshRewards();
    } else {
      alert('Failed to save reward');
    }
    setLoading(false);
  };

  const handleEdit = (reward) => {
    setEditingReward(reward);
    setFormData(reward);
  };

  const handleDelete = async (rewardId) => {
    setLoading(true);
    const { status } = await requestAPI(`/rewards/${rewardId}`, 'delete');
    if (status >= 200 && status < 300) {
      alert('Reward deleted successfully');
      refreshRewards();
    } else {
      alert('Failed to delete reward');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CommunityNavBar />
      <div className="container mx-auto mt-5">
        <Typography variant="h4" className="mb-4">Manage Rewards</Typography>
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
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
            />
          </div>
          <Button type="submit" className="mt-4" disabled={loading}>
            {editingReward ? 'Update Reward' : 'Add Reward'}
          </Button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p>Loading rewards...</p>
          ) : (
            rewards.map((reward) => (
              <Card key={reward.id} className="p-4">
                <Typography variant="h6">{reward.name}</Typography>
                <Typography variant="small">{reward.type}</Typography>
                <Typography variant="small">{reward.description}</Typography>
                {reward.image && <img src={reward.image} alt={reward.name} className="mt-2" />}
                <div className="flex justify-end mt-4">
                  <IconButton variant="text" onClick={() => handleEdit(reward)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </IconButton>
                  <IconButton variant="text" onClick={() => handleDelete(reward.id)}>
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

export default AddRewards;