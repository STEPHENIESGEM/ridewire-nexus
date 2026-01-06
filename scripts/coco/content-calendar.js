/**
 * COCO Content Calendar - Automated Scheduling
 * 
 * Manages content scheduling and automated uploads (3x/week)
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Generate content calendar
 * @param {Object} config - COCO configuration
 * @param {number} weeksAhead - Number of weeks to plan ahead
 * @returns {Promise<Array>} Content calendar entries
 */
async function generateCalendar(config, weeksAhead = 4) {
  console.log(`📅 Generating ${weeksAhead}-week content calendar...`);

  const schedule = config.content_strategy.upload_schedule;
  const contentTypes = config.content_strategy.content_types;
  
  const calendar = [];
  const today = new Date();

  // Map day names to day numbers (0 = Sunday, 1 = Monday, etc.)
  const dayMap = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
    'Thursday': 4, 'Friday': 5, 'Saturday': 6
  };

  // Get upload days as numbers
  const uploadDays = schedule.days.map(day => dayMap[day]);

  // Generate calendar entries
  let contentTypeIndex = 0;
  for (let week = 0; week < weeksAhead; week++) {
    for (const uploadDay of uploadDays) {
      const date = getNextDate(today, uploadDay, week);
      const contentType = contentTypes[contentTypeIndex % contentTypes.length];

      calendar.push({
        date: date.toISOString().split('T')[0],
        time: schedule.time,
        dayOfWeek: schedule.days[uploadDays.indexOf(uploadDay)],
        contentType: contentType.type,
        description: contentType.description,
        suggestedTopics: contentType.topics,
        status: 'scheduled'
      });

      contentTypeIndex++;
    }
  }

  // Save calendar
  const calendarPath = path.join(__dirname, '../../data/coco/content-calendar.json');
  await fs.mkdir(path.dirname(calendarPath), { recursive: true });
  await fs.writeFile(calendarPath, JSON.stringify(calendar, null, 2));

  console.log(`✅ Calendar generated: ${calendar.length} videos scheduled`);
  console.log(`   First video: ${calendar[0].date} (${calendar[0].dayOfWeek})`);
  console.log(`   Last video: ${calendar[calendar.length - 1].date}`);

  return calendar;
}

/**
 * Get next occurrence of a specific day
 */
function getNextDate(startDate, targetDay, weekOffset = 0) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + (7 * weekOffset));
  
  const currentDay = date.getDay();
  const daysUntilTarget = (targetDay - currentDay + 7) % 7;
  
  date.setDate(date.getDate() + daysUntilTarget);
  return date;
}

/**
 * Get today's scheduled content
 * @returns {Promise<Object|null>} Today's content item or null
 */
async function getTodaysContent() {
  const calendarPath = path.join(__dirname, '../../data/coco/content-calendar.json');

  try {
    const data = await fs.readFile(calendarPath, 'utf8');
    const calendar = JSON.parse(data);

    const today = new Date().toISOString().split('T')[0];
    const todaysContent = calendar.find(item => item.date === today);

    return todaysContent || null;

  } catch (error) {
    console.warn('   ⚠️  Content calendar not found');
    return null;
  }
}

/**
 * Get upcoming content
 * @param {number} days - Number of days to look ahead
 * @returns {Promise<Array>} Upcoming content items
 */
async function getUpcomingContent(days = 7) {
  const calendarPath = path.join(__dirname, '../../data/coco/content-calendar.json');

  try {
    const data = await fs.readFile(calendarPath, 'utf8');
    const calendar = JSON.parse(data);

    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + days);

    return calendar.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= today && itemDate <= futureDate;
    });

  } catch (error) {
    return [];
  }
}

/**
 * Mark content as completed
 * @param {string} date - Date of content (YYYY-MM-DD)
 * @param {string} videoId - Generated video ID
 * @param {string} youtubeId - YouTube video ID (optional)
 */
async function markCompleted(date, videoId, youtubeId = null) {
  const calendarPath = path.join(__dirname, '../../data/coco/content-calendar.json');

  try {
    const data = await fs.readFile(calendarPath, 'utf8');
    const calendar = JSON.parse(data);

    const itemIndex = calendar.findIndex(item => item.date === date);
    if (itemIndex === -1) {
      console.warn('   ⚠️  Calendar item not found');
      return;
    }

    calendar[itemIndex].status = 'completed';
    calendar[itemIndex].videoId = videoId;
    calendar[itemIndex].youtubeId = youtubeId;
    calendar[itemIndex].completedAt = new Date().toISOString();

    await fs.writeFile(calendarPath, JSON.stringify(calendar, null, 2));
    console.log(`   ✓ Content marked as completed for ${date}`);

  } catch (error) {
    console.error('   ❌ Failed to update calendar:', error.message);
  }
}

/**
 * Get content statistics
 * @returns {Promise<Object>} Calendar statistics
 */
async function getStats() {
  const calendarPath = path.join(__dirname, '../../data/coco/content-calendar.json');

  try {
    const data = await fs.readFile(calendarPath, 'utf8');
    const calendar = JSON.parse(data);

    const stats = {
      total: calendar.length,
      completed: calendar.filter(item => item.status === 'completed').length,
      scheduled: calendar.filter(item => item.status === 'scheduled').length,
      overdue: 0
    };

    // Calculate overdue
    const today = new Date().toISOString().split('T')[0];
    stats.overdue = calendar.filter(item => {
      return item.status === 'scheduled' && item.date < today;
    }).length;

    stats.completionRate = stats.total > 0 
      ? ((stats.completed / stats.total) * 100).toFixed(1) + '%'
      : '0%';

    return stats;

  } catch (error) {
    return {
      total: 0,
      completed: 0,
      scheduled: 0,
      overdue: 0,
      completionRate: '0%',
      error: 'Calendar not found'
    };
  }
}

/**
 * Suggest topics based on content type
 * @param {string} contentType - Type of content
 * @returns {Array<string>} Suggested topics
 */
function suggestTopics(contentType) {
  const topicPool = {
    quick_fix: [
      'P0300 Random Misfire - Quick Diagnosis',
      'Check Engine Light: Top 5 Common Causes',
      'Motorcycle Won\'t Start - 3-Minute Fix',
      'Battery Testing Without Tools',
      'Spark Plug Diagnosis in 5 Minutes'
    ],
    ai_diagnostics: [
      'Multi-AI Consensus: Complex Electrical Issues',
      'ChatGPT vs Claude vs Gemini: Diagnostic Showdown',
      'RideWire AI Hub Demo: Real-Time Diagnosis',
      'How AI Beats Traditional Diagnostics',
      'AI-Powered OBD-II Analysis'
    ],
    product_review: [
      'Best OBD-II Scanners for Motorcycles',
      'RideWire Platform Review: Week 1 Results',
      'Top 5 Diagnostic Tools Under $100',
      'Harley-Davidson Diagnostic Software Comparison',
      'Must-Have Tools for DIY Mechanics'
    ],
    troubleshooting: [
      'Electrical Gremlins: Finding Phantom Issues',
      'Engine Stalling: Complete Diagnostic Guide',
      'Sensor Failure Patterns You Need to Know',
      'Intermittent Problems: The Detective\'s Guide',
      'Fuel System Diagnostics from A to Z'
    ]
  };

  return topicPool[contentType] || [];
}

module.exports = {
  generateCalendar,
  getTodaysContent,
  getUpcomingContent,
  markCompleted,
  getStats,
  suggestTopics
};
