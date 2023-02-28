import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import RatingStar from "react-rating-stars-component";
import Header from "../components/Header";
import { db } from "../firebase/firebase";

const ManageReviews = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    return onSnapshot(
      query(collection(db, "reviews"), where("reaction", "==", "")),
      (snapshots) => {
        const tempData = [];
        snapshots.forEach((snapshot) => tempData.push(snapshot.data()));
        setReviews(tempData);
        console.log(tempData);
        setIsLoading(false);
      }
    );
  }, []);
  return (
    !isLoading && (
      <div>
        <Header title="Reviews" />
        <div className="flex gap-x-8 gap-y-4 flex-wrap">
          {reviews.map((review, index) => (
            <div key={index} className="w-[300px] flex flex-col gap-3">
              <h2>Order: {review.orderId}</h2>

              <div className="flex w-full h-full items-center gap-2">
                <p>Rating: </p>{" "}
                <RatingStar
                  value={review.rating}
                  edit={false}
                  size={24}
                  activeColor="#ffd700"
                />
              </div>
              <p>Review by: {review.reviewer}</p>
              <p>Reviewers Name: {review.name || ""}</p>
              <p>Reviews Phone: {review.phoneNumber || ""}</p>

              <p>Review: {review.review}</p>
              <div>
                <button
                  onClick={() => {
                    setDoc(
                      doc(db, "reviews", review.id),
                      { reaction: "approved" },
                      { merge: true }
                    );
                  }}
                  className="py-1 mr-3 px-2 rounded-lg bg-green-600 text-white"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    setDoc(
                      doc(db, "reviews", review.id),
                      { reaction: "dismissed" },
                      { merge: true }
                    );
                  }}
                  className="py-1 px-2 rounded-lg bg-red-600 text-white"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default ManageReviews;
