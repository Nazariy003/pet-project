import {IQuestion} from './models/question.interface';

export const AVAILABLE_TOPICS: string[] = [
  'angular',
  'react',
  'nodejs',
  'typescript',
  'javascript',
  'axios',
  'frontend',
  'backend',
  'web development',
  'API'
];

export const MOCK_QUESTIONS: IQuestion[] = [
  {
    id: 1,
    title: 'Unmatched Toner Cartridge Quality 20 Less Than Oem Price',
    type: 'code',
    topics: ['angular', 'ok', 'nodejs', 'front-end', 'react'],
    description:
      "Last month, my wife, Anne Doe, took me to Las Vegas because she had to go for a business convention. Needless to say, she writes for an guide to casinos and I hate gambling. But then, she likes it and gambling is something I can't stand. But then, she likes it and insisted that I tag along.",
    time: 15
  },
  {
    id: 2,
    title: 'How to Optimize Your Website for Better Performance',
    type: 'code',
    topics: ['performance', 'optimization', 'web'],
    description:
      "Optimizing your website for performance is crucial for user experience and SEO. Here are some tips to improve your website's speed and efficiency.",
    time: 10
  },
  {
    id: 3,
    title: 'Best Practices for Writing Clean Code',
    type: 'code',
    topics: ['clean-code', 'best-practices', 'programming'],
    description:
      'Writing clean code is essential for maintainability and collaboration. Follow these best practices to ensure your code is readable and efficient.',
    time: 12
  },
  {
    id: 4,
    title: 'Understanding Asynchronous Programming in JavaScript',
    type: 'code',
    topics: ['javascript', 'async', 'programming'],
    description:
      'Asynchronous programming is a powerful technique that allows non-blocking operations. Learn how to handle promises, async/await, and callbacks effectively in JavaScript.',
    time: 20
  },
  {
    id: 5,
    title: 'Building RESTful APIs with Node.js and Express',
    type: 'text',
    topics: ['nodejs', 'express', 'api'],
    description:
      'Learn how to build scalable and efficient RESTful APIs using Node.js and Express. This guide covers everything from routing to error handling.',
    time: 18
  },
  {
    id: 6,
    title: 'Introduction to TypeScript: Benefits and Setup',
    type: 'text',
    topics: ['typescript', 'programming', 'frontend'],
    description:
      'TypeScript is a superset of JavaScript that adds type safety to your code. In this guide, we will explore the basics of TypeScript and how to set it up in your project.',
    time: 14
  },
  {
    id: 7,
    title: 'How to Implement Authentication in Angular',
    type: 'code',
    topics: ['angular', 'auth', 'frontend'],
    description:
      'Authentication is a critical part of any web application. In this tutorial, we will walk through the process of implementing authentication in Angular using JWT tokens.',
    time: 16
  },
  {
    id: 8,
    title: 'Mastering CSS Flexbox for Layout Design',
    type: 'text',
    topics: ['css', 'layout', 'frontend'],
    description:
      'CSS Flexbox is a powerful layout tool for building responsive websites. Learn how to create complex layouts with ease using Flexbox.',
    time: 12
  },
  {
    id: 9,
    title: 'An Introduction to Machine Learning Concepts',
    type: 'code',
    topics: ['machine-learning', 'ai', 'python'],
    description:
      'Machine learning is revolutionizing many industries. This guide will introduce the key concepts of machine learning, including supervised and unsupervised learning.',
    time: 22
  },
  {
    id: 10,
    title: 'How to Set Up Docker for Your Development Environment',
    type: 'code',
    topics: ['docker', 'devops', 'containerization'],
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis',
    time: 17
  }
];
