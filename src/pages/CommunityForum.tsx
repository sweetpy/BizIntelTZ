import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, MessageSquare, Plus, ThumbsUp, ThumbsDown, ArrowLeft, Hash, Crown } from 'lucide-react'
import { getForumPosts, getCommunityTags, createPost, voteOnPost, joinCommunity } from '../utils/api'
import { ForumPost, CommunityTag, ForumCategory } from '../types'
import toast from 'react-hot-toast'

const CommunityForum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [tags, setTags] = useState<CommunityTag[]>([])
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[]
  })

  useEffect(() => {
    loadForumData()
  }, [selectedCategory])

  const loadForumData = async () => {
    try {
      setIsLoading(true)
      const [postsData, tagsData] = await Promise.all([
        getForumPosts(selectedCategory),
        getCommunityTags()
      ])
      setPosts(postsData)
      setTags(tagsData)
    } catch (error) {
      console.error('Error loading forum data:', error)
      toast.error('Failed to load forum data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createPost(newPost)
      toast.success('Post created successfully!')
      setShowCreatePost(false)
      setNewPost({ title: '', content: '', category: '', tags: [] })
      await loadForumData()
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Failed to create post')
    }
  }

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    try {
      await voteOnPost(postId, voteType)
      // Update local state
      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              upvotes: voteType === 'up' ? post.upvotes + 1 : post.upvotes,
              downvotes: voteType === 'down' ? post.downvotes + 1 : post.downvotes
            }
          : post
      ))
    } catch (error) {
      console.error('Error voting on post:', error)
      toast.error('Failed to vote on post')
    }
  }

  const handleJoinCommunity = async (tagName: string) => {
    try {
      await joinCommunity(tagName)
      toast.success(`Joined ${tagName} community!`)
      await loadForumData()
    } catch (error) {
      console.error('Error joining community:', error)
      toast.error('Failed to join community')
    }
  }

  const toggleTag = (tag: string) => {
    const tags = newPost.tags.includes(tag)
      ? newPost.tags.filter(t => t !== tag)
      : [...newPost.tags, tag]
    setNewPost({ ...newPost, tags })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
              <p className="text-gray-600">Peer validation, discussions, and vertical micro-communities</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setShowCreatePost(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Post</span>
        </button>
      </div>

      {/* Community Tags */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Communities</h3>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <div key={tag.name} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-primary-600" />
                <span className="font-medium text-gray-900">{tag.name}</span>
                <span className="text-sm text-gray-600">({tag.member_count})</span>
              </div>
              {tag.is_member ? (
                <span className="text-xs bg-success-100 text-success-800 px-2 py-1 rounded-full">
                  Member
                </span>
              ) : (
                <button
                  onClick={() => handleJoinCommunity(tag.name)}
                  className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full hover:bg-primary-200 transition-colors"
                >
                  Join
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Categories:</span>
        <div className="flex flex-wrap gap-2">
          {['all', 'general', 'business-tips', 'networking', 'funding', 'marketing', 'technology'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Forum Posts */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="card p-6">
              <div className="flex items-start space-x-4">
                <div className="flex flex-col items-center space-y-2">
                  <button
                    onClick={() => handleVote(post.id, 'up')}
                    className="p-1 text-gray-600 hover:text-success-600 transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-medium text-gray-900">
                    {post.upvotes - post.downvotes}
                  </span>
                  <button
                    onClick={() => handleVote(post.id, 'down')}
                    className="p-1 text-gray-600 hover:text-error-600 transition-colors"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                    {post.is_featured && (
                      <Crown className="h-4 w-4 text-warning-500" />
                    )}
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{post.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{post.author_name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.replies_count} replies</span>
                      </div>
                      <span>{post.created_at}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Post</h3>
            
            <form onSubmit={handleCreatePost} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="input"
                  placeholder="Post title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select category</option>
                  <option value="general">General Discussion</option>
                  <option value="business-tips">Business Tips</option>
                  <option value="networking">Networking</option>
                  <option value="funding">Funding & Investment</option>
                  <option value="marketing">Marketing</option>
                  <option value="technology">Technology</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  required
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="input h-32 resize-none"
                  placeholder="Share your thoughts..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.name}
                      type="button"
                      onClick={() => toggleTag(tag.name)}
                      className={`text-xs px-3 py-1 rounded-full transition-colors ${
                        newPost.tags.includes(tag.name)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommunityForum