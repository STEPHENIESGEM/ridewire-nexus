#!/usr/bin/env node

/**
 * COCO AI Influencer - Content Calendar Manager
 * 
 * Manages scheduling for 3x per week YouTube uploads
 * Schedule: Monday, Wednesday, Friday at 9:00 AM
 * 
 * Features:
 * - Auto-generates content queue
 * - Tracks upload schedule
 * - Manages topic rotation
 * - Monitors publishing status
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

class ContentCalendar {
  constructor() {
    this.calendarPath = path.join(__dirname, '../../data/coco-calendar.json');
    this.topicQueuePath = path.join(__dirname, '../../data/coco-topics.json');
    this.dataDir = path.join(__dirname, '../../data');
    
    // Default publishing schedule: Mon/Wed/Fri at 9:00 AM
    this.publishDays = [1, 3, 5]; // Monday = 1, Wednesday = 3, Friday = 5
    this.publishTime = { hour: 9, minute: 0 };
  }

  /**
   * Initialize calendar and topic queue
   */
  async initialize() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      
      // Initialize calendar if doesn't exist
      try {
        await fs.access(this.calendarPath);
      } catch {
        await this.createCalendar();
      }
      
      // Initialize topic queue if doesn't exist
      try {
        await fs.access(this.topicQueuePath);
      } catch {
        await this.createDefaultTopics();
      }
      
      console.log('✅ Calendar initialized');
    } catch (error) {
      console.error('❌ Calendar initialization failed:', error.message);
      throw error;
    }
  }

  /**
   * Create empty calendar
   */
  async createCalendar() {
    const calendar = {
      created: new Date().toISOString(),
      schedule: {
        days: this.publishDays,
        time: this.publishTime,
        timezone: 'America/New_York'
      },
      upcomingDates: [],
      published: [],
      pending: []
    };
    
    await fs.writeFile(this.calendarPath, JSON.stringify(calendar, null, 2));
    console.log('📅 Calendar created');
  }

  /**
   * Create default topic queue from problem statement
   */
  async createDefaultTopics() {
    const topics = {
      queue: [
        {
          id: 1,
          title: "Check Engine Light Quick Fix P0300",
          category: "diagnostic_codes",
          priority: "high",
          targetLength: 3,
          keywords: ["P0300", "check engine light", "misfire", "diagnostic"],
          status: "queued"
        },
        {
          id: 2,
          title: "Harley Davidson Diagnostic Codes Explained",
          category: "motorcycle",
          priority: "high",
          targetLength: 5,
          keywords: ["Harley Davidson", "diagnostic codes", "motorcycle"],
          status: "queued"
        },
        {
          id: 3,
          title: "AI Multi-Agent Consensus for Brake Problems",
          category: "ai_diagnostics",
          priority: "high",
          targetLength: 3,
          keywords: ["AI diagnostics", "brakes", "multi-agent", "consensus"],
          status: "queued"
        },
        {
          id: 4,
          title: "Top 5 OBD-II Scanner Features to Look For",
          category: "tools",
          priority: "medium",
          targetLength: 4,
          keywords: ["OBD-II", "scanner", "diagnostic tools"],
          status: "queued"
        },
        {
          id: 5,
          title: "How to Read Transmission Fault Codes",
          category: "diagnostic_codes",
          priority: "medium",
          targetLength: 3,
          keywords: ["transmission", "fault codes", "diagnostics"],
          status: "queued"
        },
        {
          id: 6,
          title: "Electric Vehicle Diagnostic Basics for Beginners",
          category: "ev_diagnostics",
          priority: "high",
          targetLength: 4,
          keywords: ["electric vehicle", "EV", "diagnostics", "beginner"],
          status: "queued"
        },
        {
          id: 7,
          title: "Understanding ABS Brake System Warning Lights",
          category: "brakes",
          priority: "medium",
          targetLength: 3,
          keywords: ["ABS", "brakes", "warning lights"],
          status: "queued"
        },
        {
          id: 8,
          title: "AI-Powered Engine Diagnostics: The Future is Here",
          category: "ai_diagnostics",
          priority: "high",
          targetLength: 5,
          keywords: ["AI", "engine diagnostics", "future tech"],
          status: "queued"
        },
        {
          id: 9,
          title: "Common Ford F-150 Diagnostic Issues and Solutions",
          category: "vehicle_specific",
          priority: "medium",
          targetLength: 4,
          keywords: ["Ford F-150", "diagnostic issues", "solutions"],
          status: "queued"
        },
        {
          id: 10,
          title: "Diesel Engine Diagnostic Codes: A Complete Guide",
          category: "diagnostic_codes",
          priority: "medium",
          targetLength: 5,
          keywords: ["diesel", "diagnostic codes", "engine"],
          status: "queued"
        }
      ],
      categories: {
        diagnostic_codes: "OBD-II and error code explanations",
        motorcycle: "Motorcycle-specific diagnostics",
        ai_diagnostics: "AI-powered diagnostic tools and methods",
        tools: "Diagnostic tools and equipment reviews",
        ev_diagnostics: "Electric vehicle diagnostics",
        brakes: "Brake system diagnostics",
        vehicle_specific: "Vehicle-specific diagnostic guides"
      }
    };
    
    await fs.writeFile(this.topicQueuePath, JSON.stringify(topics, null, 2));
    console.log('📋 Default topic queue created with 10 topics');
  }

  /**
   * Get next scheduled publishing dates
   */
  getNextPublishDates(count = 12) {
    const dates = [];
    const now = new Date();
    let currentDate = new Date(now);
    
    while (dates.length < count) {
      currentDate.setDate(currentDate.getDate() + 1);
      
      const dayOfWeek = currentDate.getDay();
      
      if (this.publishDays.includes(dayOfWeek)) {
        const publishDate = new Date(currentDate);
        publishDate.setHours(this.publishTime.hour);
        publishDate.setMinutes(this.publishTime.minute);
        publishDate.setSeconds(0);
        publishDate.setMilliseconds(0);
        
        dates.push(publishDate.toISOString());
      }
    }
    
    return dates;
  }

  /**
   * Get next topic from queue
   */
  async getNextTopic() {
    try {
      const data = await fs.readFile(this.topicQueuePath, 'utf8');
      const topics = JSON.parse(data);
      
      const nextTopic = topics.queue.find(t => t.status === 'queued');
      
      if (!nextTopic) {
        console.warn('⚠️  No topics in queue!');
        return null;
      }
      
      return nextTopic;
    } catch (error) {
      console.error('❌ Failed to get next topic:', error.message);
      return null;
    }
  }

  /**
   * Mark topic as in progress
   */
  async markTopicInProgress(topicId) {
    try {
      const data = await fs.readFile(this.topicQueuePath, 'utf8');
      const topics = JSON.parse(data);
      
      const topic = topics.queue.find(t => t.id === topicId);
      if (topic) {
        topic.status = 'in_progress';
        topic.startedAt = new Date().toISOString();
        await fs.writeFile(this.topicQueuePath, JSON.stringify(topics, null, 2));
        console.log(`✅ Topic ${topicId} marked as in progress`);
      }
    } catch (error) {
      console.error('❌ Failed to update topic status:', error.message);
    }
  }

  /**
   * Mark topic as completed
   */
  async markTopicCompleted(topicId, videoId) {
    try {
      const data = await fs.readFile(this.topicQueuePath, 'utf8');
      const topics = JSON.parse(data);
      
      const topic = topics.queue.find(t => t.id === topicId);
      if (topic) {
        topic.status = 'completed';
        topic.completedAt = new Date().toISOString();
        topic.videoId = videoId;
        await fs.writeFile(this.topicQueuePath, JSON.stringify(topics, null, 2));
        console.log(`✅ Topic ${topicId} marked as completed`);
      }
    } catch (error) {
      console.error('❌ Failed to update topic status:', error.message);
    }
  }

  /**
   * Schedule next N videos
   */
  async scheduleUpcoming(count = 4) {
    await this.initialize();
    
    console.log(`\n📅 Scheduling next ${count} video uploads\n`);
    
    const dates = this.getNextPublishDates(count);
    const data = await fs.readFile(this.topicQueuePath, 'utf8');
    const topics = JSON.parse(data);
    
    const queuedTopics = topics.queue.filter(t => t.status === 'queued');
    
    if (queuedTopics.length < count) {
      console.warn(`⚠️  Only ${queuedTopics.length} topics available, scheduling all`);
    }
    
    const schedule = [];
    const scheduleCount = Math.min(count, queuedTopics.length);
    
    for (let i = 0; i < scheduleCount; i++) {
      schedule.push({
        date: dates[i],
        topic: queuedTopics[i].title,
        topicId: queuedTopics[i].id,
        status: 'scheduled'
      });
      
      console.log(`📌 ${dates[i]}: ${queuedTopics[i].title}`);
    }
    
    // Update calendar
    const calendarData = await fs.readFile(this.calendarPath, 'utf8');
    const calendar = JSON.parse(calendarData);
    calendar.upcomingDates = schedule;
    calendar.lastUpdated = new Date().toISOString();
    await fs.writeFile(this.calendarPath, JSON.stringify(calendar, null, 2));
    
    console.log('\n✅ Schedule updated successfully');
    
    return schedule;
  }

  /**
   * Display current schedule
   */
  async displaySchedule() {
    await this.initialize();
    
    const calendarData = await fs.readFile(this.calendarPath, 'utf8');
    const calendar = JSON.parse(calendarData);
    
    console.log('\n📅 COCO Content Calendar\n');
    console.log(`Schedule: ${calendar.schedule.days.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')} at ${calendar.schedule.time.hour}:${String(calendar.schedule.time.minute).padStart(2, '0')}`);
    console.log(`Timezone: ${calendar.schedule.timezone}\n`);
    
    if (calendar.upcomingDates.length > 0) {
      console.log('Upcoming Uploads:');
      calendar.upcomingDates.forEach((item, i) => {
        const date = new Date(item.date);
        console.log(`  ${i + 1}. ${date.toLocaleDateString()} ${date.toLocaleTimeString()}: ${item.topic}`);
      });
    } else {
      console.log('No upcoming uploads scheduled. Run with --schedule to create schedule.');
    }
    
    console.log(`\nPublished: ${calendar.published.length} videos`);
    console.log(`Pending: ${calendar.pending.length} videos\n`);
  }
}

// CLI interface
if (require.main === module) {
  const calendar = new ContentCalendar();
  const args = process.argv.slice(2);
  
  if (args.includes('--schedule')) {
    const count = parseInt(args[args.indexOf('--schedule') + 1]) || 4;
    calendar.scheduleUpcoming(count).catch(console.error);
  } else if (args.includes('--next')) {
    calendar.getNextTopic().then(topic => {
      if (topic) {
        console.log('\n📋 Next Topic:');
        console.log(JSON.stringify(topic, null, 2));
      }
    }).catch(console.error);
  } else {
    calendar.displaySchedule().catch(console.error);
  }
}

module.exports = ContentCalendar;
