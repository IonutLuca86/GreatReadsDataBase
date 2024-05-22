import React, { useState, useEffect } from 'react';
import { FaRegSmileWink } from "react-icons/fa";
import tokenValidation from '../Functions/TokenValidation';
import deleteReview from '../Functions/DeleteReview';
import addNewReview from '../Functions/AddNewReview';
import { useNavigate } from 'react-router-dom';
import getBookReviews from '../Functions/GetBookReviews';
import editReview from '../Functions/EditReview';



const ReviewComponent = ({ bookId,currentUser}) => {
  const navigate = useNavigate();
  const [initialreviews,setInitialReviews] = useState([]);
  const [reviews, setReviews] = useState();
  const [reviewText, setReviewText] = useState('');
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true); 
  const [editReviewId, setEditReviewId] = useState(null); 
  const [editedReviewContent, setEditedReviewContent] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reviewIdToDelete,setReviewIdToDelete] = useState();

  const fetchData = async () => {
    try {       
        const reviewsResponse = await getBookReviews(bookId);     
        const sortedReviews = reviewsResponse.sort((a,b) => b.id-a.id);
        setInitialReviews(sortedReviews);
        setReviews(sortedReviews.slice(0,5));
    } catch (error) {
        console.error('Error fetching book info:', error);
    }
}; 

  useEffect(() => {   
    fetchData();
},[]);

  const handleChange = (e) => {
    setReviewText(e.target.value);
    setSubmitButtonDisabled(e.target.value.trim() === ''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try{
      const token = tokenValidation(navigate);
      if(token)
        {  
          var response = await addNewReview(bookId,currentUser.id,reviewText,token); 
          if(response)
            {
              fetchData();   
            }          
        }
   }catch (error) {
      console.error('Error fetching book info:', error);
  }   
    setReviewText(''); 
    setSubmitButtonDisabled(true); 
  };

  const handleShowMore = () => {
    const nextSliceLength = Math.min(5, initialreviews.length - reviews.length); 
    const nextReviews = initialreviews.slice(reviews.length, reviews.length + nextSliceLength);
    setReviews([...reviews, ...nextReviews]); 
  };

  const handleDeleteReview = async (reviewId) => {
   setShowConfirmation(true);
   setReviewIdToDelete(reviewId);
    };


  const handleEditReview =async (reviewId) => {
    setEditReviewId(reviewId); 
    setEditedReviewContent(reviews.find((review) => review.id === reviewId).reviewContent); 
  };

  const handleSaveReview = async (reviewId) => {
    try{
      const token = tokenValidation(navigate);
      if(token)
        {  
          var response = await editReview(reviewId,bookId,currentUser.id,editedReviewContent,token);
          if(response)
          {
            fetchData();   
          }
        }
   }catch (error) {
      console.error('Error fetching book info:', error);
  }
    console.log('Saving review content:', editedReviewContent); // Example for now
    setEditReviewId(null); // Clear edited review ID
  };

  const handleCancelEdit = () => {
    setEditReviewId(null); // Clear edited review ID
    setEditedReviewContent(''); // Clear edited content
  };
  const handleConfirmDelete = async () => { 
    setShowConfirmation(false);
    try{
      const token = tokenValidation(navigate);
      if(token)
        {  
          var response = await deleteReview(reviewIdToDelete,token);
          if(response)
          {
            fetchData();   
          }
        }
   }catch (error) {
      console.error('Error fetching book info:', error);
  }
    const updatedReviews = reviews.filter((review) => review.id !== reviewId);
    setReviews(updatedReviews);
   
};

const handleCancelDelete = () => {
    setShowConfirmation(false);
};

  const renderReviews = () => {
    return reviews.length > 0 ? reviews.map((review) => (
      <div key={review.id} className="review-item">
        <div className="review-user">
          <span >{review.book.user.userName}:</span>
        </div>
        <div className="review-content">
          {editReviewId === review.id ? (<textarea
            value={editedReviewContent}
            onChange={(e) => setEditedReviewContent(e.target.value)}
          ></textarea>            
          ) : ( <p>{review.reviewContent}</p>) }
   
          {review.book.user.id === currentUser.id && ( 
            <div className='review-actions'>
            {editReviewId === review.id ? ( 
              <>
                <button onClick={() => handleSaveReview(review.id)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <button onClick={() => handleEditReview(review.id)}>Edit</button>
            )}
            <button onClick={() => handleDeleteReview(review.id)} className='deleteBtn'>Delete</button>
            {showConfirmation && (
                            <div className="confirmation-overlay">
                                <div className="confirmation-modal">
                                    <p>Are you sure you want to delete?</p>
                                    <div>
                                    <button onClick={handleConfirmDelete} className="me-5">Yes</button>
                                    <button onClick={handleCancelDelete}>No</button>
                                    </div>
                                   
                                </div>
                            </div>
                        )}
          </div>
          )}
        </div>
      </div>
    )) : <p>Sorry, there are no reviews for this book. Be the first to leave a review!</p>;
  };

  return (
    <div className="review-container">
      <h2 className='book-title'>Reviews</h2>
      {reviews ? renderReviews() : (<p>Loading...</p>)}
      {reviews ? reviews.length < initialreviews.length && ( 
        <button onClick={handleShowMore} className='login-button'>Show More</button>
      ) : (<></>)}
      <div className="new-review">
        <h3 className='book-title'>Leave a Review</h3>
        <form className="review-form" onSubmit={handleSubmit}>     
      <textarea
        name="review"
        placeholder="Write your review here..."
        value={reviewText}
        onChange={handleChange}
        className='review-textarea'
      />
      <button type="submit" disabled={submitButtonDisabled} >
        Submit Review
      </button>
    </form>      
      </div>
    </div>
  );
};

export default ReviewComponent;
