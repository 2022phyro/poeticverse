import React from 'react';

function CommentSection() {
  return (
    <div className="comment-section">
      {/* Explore Bar */}
      <div className="explore-bar">
        <div className="explore-text">Explore</div>
        <div className="explore-icon">
          {/* You can replace this with your explore icon */}
          <i className="fas fa-compass"></i>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
        />
      </div>

      {/* Comment Cards */}
      <div className="comment-cards">
        {/* Comment Card 1 */}
        <div className="comment-card">
          <div className="profile-picture">
            {/* You can replace this with the user's profile picture */}
            <img src="profile1.jpg" alt="User 1" />
          </div>
          <div className="user-info">
            <div className="user-name">User 1</div>
            <div className="user-comment">
              This is the first comment by User 1.
            </div>
            <div className="comment-icons">
              <span className="comments-icon">
                <i className="fas fa-comment"></i> 10
              </span>
              <span className="likes-icon">
                <i className="fas fa-thumbs-up"></i> 20
              </span>
            </div>
          </div>
        </div>

        {/* Comment Card 2 */}
        <div className="comment-card">
          <div className="profile-picture">
            {/* You can replace this with the user's profile picture */}
            <img src="profile2.jpg" alt="User 2" />
          </div>
          <div className="user-info">
            <div className="user-name">User 2</div>
            <div className="user-comment">
              This is the second comment by User 2.
            </div>
            <div className="comment-icons">
              <span className="comments-icon">
                <i className="fas fa-comment"></i> 15
              </span>
              <span className="likes-icon">
                <i className="fas fa-thumbs-up"></i> 25
              </span>
            </div>
          </div>
        </div>

        {/* Comment Card 3 */}
        <div className="comment-card">
          <div className="profile-picture">
            {/* You can replace this with the user's profile picture */}
            <img src="profile3.jpg" alt="User 3" />
          </div>
          <div className="user-info">
            <div className="user-name">User 3</div>
            <div className="user-comment">
              This is the third comment by User 3.
            </div>
            <div className="comment-icons">
              <span className="comments-icon">
                <i className="fas fa-comment"></i> 8
              </span>
              <span className="likes-icon">
                <i className="fas fa-thumbs-up"></i> 18
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentSection;
