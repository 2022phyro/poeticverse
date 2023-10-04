import { useState } from 'react'
import '../styles/create.css'
import { Icon } from '../components/navbar'
import { useNavigate } from 'react-router-dom'
import { Field, Formik, Form, ErrorMessage } from 'formik'
import { api } from '../utils'
import * as Yup from 'yup'
const Create = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [sub, setSub] = useState(false)

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      // Check if Enter key is pressed and the input is not empty
      if (!tags.includes(tagInput)) {
        // Add the tag to the state if it's not already there
        setTags([...tags, tagInput]);
        console.log("Check")
      }
      setTagInput(''); // Clear the input field
    }
    setSub(false)
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
  };

  return (
    <>
      <div className="parent">
        <div className="title">
          <h3>Create</h3>
        </div>
        <Formik
          initialValues={{ title: '', body: '', tags: [] }}
          validationSchema={Yup.object({
            title: Yup.string().required('Every literary masterpiece needs a title'),
            body: Yup.string().required('You can\'t have a poem without a body'),
            tags: Yup.array()
          })}          
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={(e, { setSubmitting }) => {
            console.log(sub)
            setSubmitting(false)
            setSub(true)
            if (sub) {
              e.tags = tags
              if (tags == []) {
                setApiError("No tags provided")
                setSubmitting(false)
                setSub(false)
              }
              console.log('Form values', e);
              api(true).post('/poem', e)
              .then(() => {
                setSubmitting(false)
                navigate('/feed/home')
              })
            }
          }}
        >
          <Form className="create-container">
            <label htmlFor="create-title" className="create-label">
              Title
            </label>
            <Field
              id="create-title"
              type="text"
              name="title"
              placeholder="Give your poem a title"
              className="input-1"
            />
            <ErrorMessage name="title" className="loginerr" component="div" />

            <label htmlFor="create-body" className="create-label">
              Poetry Canvas
            </label>
            <Field
              id="create-body"
              as="textarea"
              className="txt-area-1"
              name="body"
              placeholder="Let your inspiration flow..."
            />
            <ErrorMessage name="body" className="loginerr" component="div" />
            <div className='_tags'>
            <ul>
              {tags.map((t) => <li key={t}><span className="del-tag" onClick={() => removeTag(t)}>x</span>{t}</li>)}
            </ul>
            </div>
            <label htmlFor="c-tags" className="create-label">
              Tags
            </label>
            <input
              id="c-tags"
              type="text"
              name="tags"
              placeholder="Tags here"
              className="txt-area"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyPress}
            />
            <ErrorMessage name="tags" className="loginerr" component="div" />

            <button type="submit" className="btn">
              Create
            </button>

            {apiError && <p className="login-err">{apiError}</p>}
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default Create

// const X = () => {
//     return (   <>  <div className="section-2">
//             <h3>Verse Title</h3>
//             <form action="">
//                 <input type="text" className='input-1' />
//             </form>
//         </div>

//         <div className="canvas">
//             <h3>Poetry Canvas</h3>
//             <textarea name="" id="" className='txt-area-1' ></textarea>
//         </div>
        // <ul className='_tags'>
        //     {tags.map((t) => <li key={t}><span className="del-tag" onClick={() => removeTag(t)}>x</span>{t}</li>)}
        // </ul>
//         <div className="filter-section">
//             <h3>Poetry Tags</h3>
//             <div className="box">
//             <input name="" id="" className='txt-area' value={tagInput}
//               onChange={handleTagInputChange}
//               onKeyDown={handleTagInputKeyPress}></input>
//             <button className='btn' onClick={handleCreateClick}>Create</button>  
//             </div>
//         </div></>)}
